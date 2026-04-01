let path = require('path')
let tailwindcss = require(path.resolve(__dirname, '..', '..', 'vite'))
let remToRpx = require('./rem-to-rpx')

module.exports = {
  plugins: [tailwindcss()],
  css: {
    postcss: {
      plugins: [remToRpx()],
    },
  },
}
