import { inspect } from 'node:util'
import { copy } from 'esbuild-plugin-copy'
import path from 'path'
import esbuildPluginTsc from 'esbuild-plugin-tsc'
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin'
//import { nodeExternalsPlugin } from 'esbuild-node-externals' //enable for fine grained control of what to include
import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck'


const copyPlugin = (doCopy, watch, log) => !doCopy ? {
  name: 'nocopy',
  setup: () => log('skip copy plugin' )
} : copy({
  watch,
  verbose: true,
  assets: [
    {
      from: ['src/**/*.ejs'],
      to: ['templates']
    }
  ]
})

const tsCheckPlugin = (check, log) => !check ? {
  name: 'noTsCheck',
  setup: () => log('skip typescriptCheck plugin' )
} : typecheckPlugin()

export default async (serverless, { copy=true, watch, tsCheck }={ copy: true }) => {

  const devMode = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
  const log = serverless?.cli?.log ? serverless?.cli?.log : console.log

  log('run esbuild')
  log('mode: ', process.env.NODE_ENV)
  //debug env vars being passed in
  //log('Environment: ', inspect(process.env, { depth: null}))
  log('run by serverless: ', !!serverless)



  return {
    color: true,
    metafile: true,
    logLevel: process.env.ESBUILD_LOG_LEVEL ? process.env.ESBUILD_LOG_LEVEL : 'info',
    outdir: serverless ? undefined : 'lambda-mount/.serverless/build/src',
    outExtension: { '.js': '.js' },
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: !devMode,
    sourcemap: devMode,
    sourcesContent: devMode,
    format: 'cjs', //needs to be cjs for lambda, but local dev environment can stay as esm/module
    target: 'node20',
    platform: 'node',
    loader: {
      '.graphql': 'text',
      '.gql': 'text',
      '.html': 'text'
    },
    resolveExtensions: ['.ts', '.js', '.mjs', '.cjs', '.graphql'],
    alias: {
      '@utils': path.resolve('src/@utils')
    },
    external: [
      '@aws-sdk/*',
      'dtrace-provider',
      'reflect-metadata'
    ],
    // packages: 'external', //use if you have a node based project. will exclude all packages, then you can systematically work out what to include later,but start with everything external
    plugins: [
      //use this if you want to take the opposite approach of exluding everything and only including certain modules in allowList
      // nodeExternalsPlugin({
      //   allowList: [],
      //   packagePath: process.env.PWD + '/package.json',
      //   cwd: process.env.PWD
      // }),
      tsCheckPlugin(tsCheck, log),
      esbuildPluginTsc({ force: true }),
      copyPlugin(copy, watch, log)
    ],
    define: {
      'global': 'global',
      'Reflect.metadata': 'Reflect.metadata'
    }
  }
}
