const { resolve } = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const LoadablePlugin = require('@loadable/webpack-plugin')

const paths = {
  src: resolve(__dirname, '..', 'src'),
  // public: resolve(__dirname, '..', 'public'),
  dist: resolve(__dirname, '..', 'build', 'client'),
  server: resolve(__dirname, '..', 'src', 'server'),
  client: resolve(__dirname, '..', 'src', 'client')
  // shared: resolve(__dirname, '..', 'src', 'shared')
}

const env = process.env.NODE_ENV
const includesPath = [paths.client]

let filename = env === 'production' ? 'static/[name]-[chunkhash].js' : 'static/[name].js'

module.exports = {
  entry: {
    main: resolve(paths.client, 'index')
  },

  output: {
    path: paths.dist,
    filename
    // publicPath: '/'
  },

  module: {
    rules: [
      { // Standard
        enforce: 'pre',
        test: /\.js$/,
        include: includesPath,
        loader: 'standard-loader',
        options: {
          parser: 'babel-eslint'
        }
      },

      { // Babel
        test: /\.js$/,
        include: includesPath,
        loader: 'babel-loader',
        query: {
          presets: [
            ['@babel/preset-env', { 'modules': false }],
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
            'babel-plugin-styled-components',
            '@loadable/babel-plugin'
          ]
        }
      },

      { // Sass
        test: /\.scss|.css$/,
        include: includesPath,
        use: sassLoader()
      },

      { // Files
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        // exclude: /node_modules/,
        include: includesPath,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1,
            name: 'media/[name].[hash:8].[ext]'
          }
        }]
      }

    ]
  },

  plugins: [
    // Global Vars
    new webpack.DefinePlugin({
      __isBrowser__: 'false',
      __platform__: JSON.stringify(process.env.PLAT)
    }),

    // Load Dynamic Imports
    // new LoadablePlugin(),

    // Mount Template Html
    ...templatePlugin(),

    // Clean Dist Folder
    new CleanWebpackPlugin(),

    new OptimizeCssAssetsPlugin(),

    // Extract Css File
    ...miniCssPlugin(),

    new CompressionPlugin({
      test: /\.(js|css|html|svg|scss)$/
    }),

    new webpack.NoEmitOnErrorsPlugin()
  ].concat(
    process.env.ANALYZER ? new BundleAnalyzerPlugin() : []
  ),

  // Define Alias
  resolve: {
    alias: {
      'src': paths.src,
      // 'shared': paths.shared,
      'client': paths.client,
      'server': paths.server,
      'components': resolve(paths.src, 'client', 'components'),
      'pages': resolve(paths.src, 'client', 'pages')
    }
  },

  // Production
  ...optimization(),

  // Log
  stats: {
    all: false,
    errors: true,
    warnings: true,
    moduleTrace: true,
    errorDetails: true,
    assets: true,
    performance: true,
    assetsSort: '!size',
    source: false
  }

}

function sassLoader () {
  if (env === 'production') {
    return [MiniCssExtractPlugin.loader, 'css-loader?modules', 'sass-loader']
  }

  return ['css-loader?modules', 'sass-loader']
}

function templatePlugin () {
  let filename = 'main.html'

  if (process.env.CLIENT_ENV) {
    filename = 'index.html'
  }

  return [
    new HtmlPlugin({
      filename,
      template: resolve(__dirname, 'template', 'template.ejs'),
      chunksSortMode: (chunk1, chunk2) => {
        const order = ['react-build', 'common', 'main']
        const left = order.indexOf(chunk1.names[0])
        const right = order.indexOf(chunk2.names[0])
        return left - right
      }
    })
  ]
}

function miniCssPlugin () {
  if (env === 'production') {
    return [
      new MiniCssExtractPlugin({
        filename: 'static/[name]-[chunkhash].css'
      })
    ]
  }

  return []
}

function optimization () {
  let optimization = {
    splitChunks: {
      cacheGroups: {
        reactBuild: {
          name: 'reactBuild',
          chunks: 'all',
          test ({ resource }, chunks) {
            return /node_modules\/(react|react-dom)/.test(resource)
          }
        },

        commons: {
          name: 'common',
          chunks: 'all',
          test ({ resource }, chunks) {
            return /node_modules\/(?!(react|react-dom))/.test(resource)
          }
        }
      }
    }

  }

  if (env === 'production') {
    return {
      optimization: {
        ...optimization,
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              output: {
                comments: false
              }
            }
          })
        ]
      }
    }
  }

  return {
    optimization: {
      ...optimization
    },
    devtool: 'eval-source-map'
  }
}
