const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const Koa = require('koa')
const compress = require('koa-compress')
const Router = require('koa-router')
const { createBundleRenderer } = require('vue-server-renderer')

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'

const app = new Koa()
const router = new Router()

const resolve = file => path.resolve(__dirname, file)

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  let start = new Date().getTime()
  let execTime
  await next()
  execTime = new Date().getTime() - start
  ctx.response.set('X-Response-Time', `${execTime}ms`)
})

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

let renderer
let html
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    },
    (htmlFile) => {
      html = htmlFile
    }
  )
}

// ssr渲染函数
async function render (ctx) {
  const s = Date.now()

  ctx.response.type = 'text/html'
  
  const handleError = err => {
    if (err.url) {
      ctx.redirect(err.url)
    } else if(err.code === 404) {
      ctx.response.status = 404
      ctx.response.body = '404 | Page Not Found'
    } else {
      // Render Error Page or Redirect
      ctx.response.status = 500
      ctx.response.body = '500 | Internal Server Error'
      // ctx.response.body = html
      console.error(`error during render : ${ctx.request.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: 'Tuile', // default title
    url: ctx.url
  }
  try {
    ctx.response.body = await renderer.renderToString(context)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  } catch (err) {
    return handleError(err)
  }
}

// app.use(compress({ threshold: 0 }))

if (!isProd) {
  const favicon = require('koa-favicon')
  const staticFiles = require('./static-files')

  // static file support
  app.use(favicon('./src/assets/images/bitbug_favicon.ico'))
  app.use(staticFiles('/manifest.json', resolve('./manifest.json')))
  
  const bodyParser = require('koa-bodyparser')
  const axios = require('axios')
  const restApiServer = require('./src/config/rest-api-server.server')
  
  // parse request body
  app.use(bodyParser())
  
  // 转接客户端的RESTapi请求
  router.all('/api/(.*)', async (ctx, next) => {
    // if (await ctx.cashed()) return
    try {
      // JWT token穿透
      axios.defaults.headers.common['Authorization'] = ctx.header.authorization
      const response = await axios({
        method: ctx.req.method,
        url: restApiServer.host + ctx.req.url,
        data: ctx.request.body
      })
      if(!response.data) console.error('Error occurred in REST api response: response.data doesn\'t exist!')
      ctx.response.type = 'application/json'
      ctx.response.body = response.data ? response.data : response
    } catch (err) {
      ctx.response.status = err.response.status
      ctx.response.body = err.response.data
    }
  })
  
  // 仅为需要SEO的页面提供SSR
  // 首页
  router.get('/', async (ctx, next) => {
    await readyPromise
    await render(ctx)
  })
  // 条目页面
  router.get('/entry/(.*)', async (ctx, next) => {
    await readyPromise
    await render(ctx)
  })
  // 词典页面
  router.get('/dictionary', async (ctx, next) => {
    await readyPromise
    await render(ctx)
  })
  // 动画列表页面
  router.get('/animes/(.*)', async (ctx, next) => {
    await readyPromise
    await render(ctx)
  })
  
  // 其余页面提供CSR
  router.get('(.*)', async (ctx, next) => {
    await readyPromise
    ctx.response.type = 'text/html'
    ctx.response.body = html
  })
} else {
  // 虽然这里设置的是(.*)，但生产环境下URL会事先通过nginx进行分发
  // 所以实际只会接收到那些需要服务端渲染的页面的URL
  // router.get('(.*)', render)
  router.get('(.*)', async (ctx, next) => {
    await render(ctx)
  })
}

app.use(router.routes())
app.use(router.allowedMethods())

const port = process.env.PORT || 3010
app.listen(port)
console.log(`app started at port ${port}...`)
