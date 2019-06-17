const { resolve } = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const paths = {
  src: resolve(__dirname, '..', 'src'),
  // public: resolve(__dirname, '..', 'public'),
  dist: resolve(__dirname, '..', 'build', 'server'),
  server: resolve(__dirname, '..', 'src', 'server'),
  client: resolve(__dirname, '..', 'src', 'client')
  // shared: resolve(__dirname, '..', 'src', 'shared')
}

const env = process.env.NODE_ENV
const includesPath = [paths.server, paths.client]

module.exports = {
  entry: resolve(paths.server, 'index'),

  target: 'node',

  externals: ['@loadable/component', nodeExternals()],

  node: {
    __dirname: false
  },

  output: {
    path: paths.dist,
    filename: 'index.js',
    libraryTarget: 'commonjs2'
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
            'dynamic-import-node-babel-7',
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
        use: ['css-loader?modules', 'sass-loader']
      },

      { // Files
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        // exclude: /node_modules/,
        include: includesPath,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1,
            name: 'media/[name].[hash:8].[ext]',
            emitFile: false
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

    // Clean Dist Folder
    new CleanWebpackPlugin()
  ],

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

function optimization () {
  if (env === 'production') {
    return {
      optimization: {
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
    devtool: 'eval-source-map'
  }
}
