// fix: mini-css-extract-plugin error on server
// 在生产环境配置中使用的mini-css-extract-plugin，打包后的server bundle中会使用到document，导致服务端渲染错误
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject (mainChunk) {
    return {}
  }
}

module.exports = process.env.VUE_ENV === 'server'
  ? ServerMiniCssExtractPlugin
  : MiniCssExtractPlugin