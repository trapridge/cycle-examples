'use strict'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const host = 'http://localhost'
const port = 8000

const config = {
  entry: [
    `webpack-dev-server/client?${host}:${port.toString()}`,
    'webpack/hot/dev-server',
    './src/'
  ],
  output: {
    filename: 'bundle.js',
    path: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader', 
            options: {
              presets: ['es2015']
            }
          },
          {
            loader: 'eslint-loader'
          }
        ],
      },
      { 
        test: /\.css$/, 
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          }, 
          {
            loader: 'css-loader',
          },
        ]
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin(),
  ]
}

const compiler = webpack(config)
compiler.plugin('done', () => {
  console.log(`App is running at ${host}:${port}`)
})
const server = new WebpackDevServer(compiler, {
  historyApiFallback: true,
  hot: true,
  contentBase: './public',
  stats: 'errors-only',
  disableHostCheck: true
})
server.listen(port)
