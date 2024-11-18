import { build } from 'esbuild'
import fs from 'fs'
import util from 'util'
import * as proc from 'child_process'
import path from 'path'
import getConfig from '../esbuild.config.js'

const exec = util.promisify(proc.exec)

const pruneSummaryFolders = () => {
  const metaDir = './esbuild-meta'

  if (!fs.existsSync(metaDir)) return

  const folders = fs.readdirSync(metaDir)
    .filter(f => fs.statSync(path.join(metaDir, f)).isDirectory())
    .sort((a, b) => b.localeCompare(a)) // Sort descending

  // Keep last 1, remove the rest
  folders.slice(process.env.ESBUILD_META_HISTORY || 1).forEach(folder => {
    fs.rmSync(path.join(metaDir, folder), { recursive: true })
  })
}

export const buildSummary = async (metafile) => {

  pruneSummaryFolders()

  const prettyBytes = (await import('pretty-bytes')).default;

  let modulesSize = 0, srcSize = 0
  let nodeModules = {}, srcFiles = []

  Object.entries(metafile.inputs).forEach(([file, data]) => {
    if (file.startsWith('node_modules/')) {
      modulesSize += data.bytes
      const [, packagePath] = file.split('node_modules/')
      const [packageName] = packagePath.split('/')

      if (!nodeModules[packageName]) {
        nodeModules[packageName] = {
          totalBytes: 0,
          files: []
        }
      }
      nodeModules[packageName].files.push(`${file} ${data.bytes}b`)
      nodeModules[packageName].totalBytes += data.bytes
    } else if (file.startsWith('src/')) {
      srcSize += data.bytes
      srcFiles.push(`${file} ${data.bytes}b`)
    }
  })

  const date = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)

  let path = `${process.env.PWD}/esbuild-meta/${date}`
  if (process.env.ESBUILD_META_PATH) {
    path = process.env.ESBUILD_META_PATH
  }


  fs.mkdirSync(path, { recursive: true })
  fs.writeFileSync(`${path}/esbuild-meta.json`, JSON.stringify(metafile))

  await exec(`esbuild-visualizer --metadata "${path}/esbuild-meta.json" --title ${date} --filename "${path}/treemap.html"`);
  await exec(`esbuild-visualizer --metadata "${path}/esbuild-meta.json" --title ${date} --filename "${path}/sunburst.html" --template sunburst`);

  const srcGroups = {}
  srcFiles.forEach(file => {
    const [, mainFolder] = file.split('src/')
    const topFolder = mainFolder.split('/')[0]

    if (!srcGroups[topFolder]) {
      srcGroups[topFolder] = []
    }
    srcGroups[topFolder].push(file)
  })

  const summary = `
Build Summary: ${Date()}

Compile Sizes:
-----------------
  source:         ${prettyBytes(srcSize)}
  node_modules:   ${prettyBytes(modulesSize)}
  total:          ${prettyBytes(srcSize+modulesSize)}


Reports: ${path}
-----------------
  esbuild-meta.json
  build-summary.txt
  build-details.txt
  treemap.html
  sunburst.html
`

const detailed = `

source files: ${prettyBytes(srcSize)}
-----------------
  ${Object.entries(srcGroups)
    .map(([folder, files]) => `${folder}:\n   ${files.join(`\n   `)}`)
    .join(`\n\n  `)}

Total source size: ${prettyBytes(srcSize)}


node_modules: ${prettyBytes(modulesSize)}
-----------------
  ${Object.entries(nodeModules)
    .sort((a, b) => b[1].totalBytes - a[1].totalBytes)
    .map(([name, data]) => `${name}: ${prettyBytes(data.totalBytes)}`)
    .join(`\n  `)}


node_modules files: ${prettyBytes(modulesSize)}
-----------------
  ${Object.entries(nodeModules)
    .sort((a, b) => b[1].totalBytes - a[1].totalBytes)
    .map(([name, data]) => `${name}: ${prettyBytes(data.totalBytes)}\n    ${data.files.join(`\n   `)}`)
    .join(`\n\n  `)}

Total modules size: ${prettyBytes(modulesSize)}

-----------------
Total Build Size: ${prettyBytes(srcSize+modulesSize)}
`

  fs.mkdirSync('./esbuild-meta', { recursive: true })
  fs.writeFileSync(`./esbuild-meta/${date}/build-summary.txt`, summary)
  fs.writeFileSync(`./esbuild-meta/${date}/build-details.txt`, detailed)

  return { summary, detailed }
}

export const getMetadata = async () => {

  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  try {
    //needs to pass watch manually to flag for the copy plugin

    const config = await getConfig(null, { noCopy: true })
    const result = await build({
      ...config,
      write: false,
      metafile: true,
      outdir: process.env.WATCH_DIR || './lambda-mount/.serverless/build/dist'
    })
    return result.metafile
  } catch(e) {
    console.error('metadata failed:', e)
    process.exit(1)
  }
}
