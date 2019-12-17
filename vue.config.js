// vue.config.js
const environment = require('./build/environment.ts')
const webpack = require('webpack')
module.exports = {
  // options...
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // configureWebpack: {
  //   plugins: [
  //     new webpack.DefinePlugin({
  //       'process.env.STAGE': JSON.stringify(environment.stage),
  //       'process.env.API_BASE_URL': JSON.stringify(environment.apiurl)
  //     })
  //   ]
  // },
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://localhost:9100/api', // 'https://new401.bafangka.com/api',
        target: 'https://new401.bafangka.com/api', // 'https://new401.bafangka.com/api',
        changeOrigin: true,
        // http2: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },

  },

};
