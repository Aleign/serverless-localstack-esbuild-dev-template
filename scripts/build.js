import { build }  from 'esbuild'
import config from '../esbuild.config.js'
import * as fs from 'fs'
import { buildSummary } from './es-metafile.js'

const runBuild = async () => {

  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  try {
    // Clean dist directory
    fs.rmSync('dist', { recursive: true, force: true })

    const result = await build(await config(null))
    await new Promise(resolve => setTimeout(resolve, 5000))
    const { summary } = await buildSummary(result.metafile)
    console.log(summary)
  } catch(e) {
    console.error('Build failed:', e)
    process.exit(1)
  }
  process.exit(0)
}

runBuild()
