const webpack = require('webpack')
const merge = require('webpack-merge')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseConfig = require('./webpack.base.config.js')

const config = merge(baseConfig, {
  entry: './entry-client.js',
  
  resolve: {
    alias: {
      'create-api': './create-api.client.js'
    }
  },
  
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ],
  
  optimization: {
    // 修复因module.id的修改而导致hash的变化
    moduleIds: 'hashed',
    // 将 webpack 的样板(boilerplate)和 manifest 提取出来。
    // 重要信息：这将 webpack 运行时(runtime)分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    runtimeChunk: 'single', 
    // // 将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendors',
    //       chunks: 'all',
    //     }
    //   }
    // }
  }
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'tuile',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        },
        {
          urlPattern: '/entry/animes/:id',
          handler: 'networkFirst'
        },
        {
          urlPattern: '/entry/persons/:id',
          handler: 'networkFirst'
        },
        {
          urlPattern: '/dictionary',
          handler: 'cacheFirst'
        }
      ]
    })
  )
}

module.exports = config