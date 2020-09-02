// common
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
// production
const MiniCssExtractPluginForSSR = require('./libs/MiniCssExtractPluginForSSR')
// development

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  
  // context(上下文)是入口文件所处的目录的绝对路径的字符串，用于从配置中解析入口起点(entry point)和 loader
  // 如果不指定，则默认使用打包时的当前目录，如animebase/
  context: path.resolve(__dirname, '../src'),
  
  devtool: isProd ? false : 'cheap-module-source-map',
  
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    // 应对缓存, 根据内容hash
    filename: isProd ? '[name].[contenthash].js' : '[name].bundle.js'
  },
  
  resolve: {
    // 自动补全的扩展名
    extensions: ['.js', '.vue', '.json', '.sass'],
    // 默认路径代理
    alias: {
      '@': path.resolve(__dirname, '../src') // @等于animebase/src
    }
  },
    
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/i,
        use: [
          isProd
            // 分离提取CSS
            ? MiniCssExtractPluginForSSR.loader
            // vue-style-loader会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            : 'vue-style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      },
      { // https://webpack.js.org/loaders/sass-loader/
        test: /\.s(c|a)ss$/,
        use: [
          isProd
            // 分离提取CSS
            ? MiniCssExtractPluginForSSR.loader
            // vue-style-loader会应用到普通的 `.css` 文件
            // 以及 `.vue` 文件中的 `<style>` 块
            : 'vue-style-loader',
          // 将 CSS 转化成 CommonJS 模块
          { loader: 'css-loader', options: { importLoaders: 2 } },
          'postcss-loader',
          // 将 Sass 编译成 CSS
          {
            loader: 'sass-loader',
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true // optional
              }
            }
          }
        ]
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      // 配置参考： https://webpack.js.org/loaders/babel-loader/
      //            https://www.webpackjs.com/loaders/babel-loader/
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-runtime',
              [ // 按需引入element-ui组件
                "component", // babel-plugin-component
                {
                  "libraryName": "element-ui",
                  "styleLibraryName": "theme-chalk"
                }
              ]
            ],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false
          }
        }]
      }
    ]
  },
  
  plugins: [
    // SSR服务端渲染专用
    new HtmlWebpackPlugin({
      template: './index.template.html',
      favicon: './assets/images/bitbug_favicon.ico'
    }),
    // CSR客户端渲染专用
    new HtmlWebpackPlugin({
      template: './index.template.csr.html',
      favicon: './assets/images/bitbug_favicon.ico',
      filename: 'index.csr.html'
    }),
    
    ...(isProd
      ? [
          new MiniCssExtractPluginForSSR({
            filename: '[name].[contenthash].css'
          })
        ]
      : []
    ),
    
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin()
  ]
}