// 本配置文件会被webpack中的postcss-loader使用
module.exports = {
  plugins: [
  // PostCSS plugin to parse CSS and add vendor prefixes to CSS rules using values from Can I Use(https://caniuse.com/).
  // autoprefixer用于添加CSS浏览器前缀
    require('autoprefixer')
  ]
}