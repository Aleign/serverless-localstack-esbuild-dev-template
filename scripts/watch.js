import { context } from 'esbuild'
import getConfig from '../esbuild.config.js'

const watch = async () => {

  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  let ctx
  try {
    //needs to pass watch manually to flag for the copy plugin

    const config = await getConfig(null, { watch: true })
    ctx = await context({
      ...config,
      outdir: process.env.WATCH_DIR || './lambda-mount/.serverless/build/src'
    })
    console.info('starting watcher...')
    await ctx.watch()
  } catch(e) {
    console.error('watch failed:', e)
    if (ctx) ctx.dispose()
    process.exit(1)
  }
}

watch()
