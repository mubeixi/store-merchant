// vue.config.js
const environment = require('./build/environment.ts')
const webpack = require('webpack')

const path = require('path')
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' )
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' )

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
        target: 'https://newo2o.bafangka.com/api', // 'https://new401t.bafangka.com/api',
        changeOrigin: true,
        // http2: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },

  },


  // The source of CKEditor is encapsulated in ES6 modules. By default, the code
  // from the node_modules directory is not transpiled, so you must explicitly tell
  // the CLI tools to transpile JavaScript files in all ckeditor5-* modules.
  transpileDependencies: [
    /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
  ],

  configureWebpack: {
    plugins: [
      // CKEditor needs its own plugin to be built using webpack.
      new CKEditorWebpackPlugin( {
        // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
        language: 'zh-cn'
      } )
    ]
  },

  // Vue CLI would normally use its own loader to load .svg and .css files, however:
  //	1. The icons used by CKEditor must be loaded using raw-loader,
  //	2. The CSS used by CKEditor must be transpiled using PostCSS to load properly.
  chainWebpack: config => {
    // (1.) To handle editor icons, get the default rule for *.svg files first:
    const svgRule = config.module.rule( 'svg' );

    // Then you can either:
    //
    // * clear all loaders for existing 'svg' rule:
    //
    		svgRule.uses.clear();
    //
    // * or exclude ckeditor directory from node_modules:
    // svgRule.exclude.add( path.join( __dirname, 'node_modules', '@ckeditor' ) );
    //加上不让webpack瞎搞svg
    // svgRule.exclude.add( path.join( __dirname, 'src', 'components','ckeditor' ) );

    // Add an entry for *.svg files belonging to CKEditor. You can either:
    //
    // * modify the existing 'svg' rule:
    //
    		svgRule.use( 'raw-loader' ).loader( 'raw-loader' );
    //
    // * or add a new one:
    // config.module
    //   .rule( 'cke-svg' )
    //   .test( /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/ )
    //   .use( 'raw-loader' )
    //   .loader( 'raw-loader' );

    // (2.) Transpile the .css files imported by the editor using PostCSS.
    // Make sure only the CSS belonging to ckeditor5-* packages is processed this way.
    config.module
      .rule( 'cke-css' )
      .test( /ckeditor5-[^/\\]+[/\\].+\.css$/ )
      .use( 'postcss-loader' )
      .loader( 'postcss-loader' )
      .tap( () => {
        return styles.getPostCssConfig( {
          themeImporter: {
            themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' ),
          },
          minify: true
        } );
      } );
  }



};
