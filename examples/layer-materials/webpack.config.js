const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackConfig = (env) => ({
  devtool: 'source-map',
  entry: './src/index.js',
  ...(env.production || !env.development ? {} : { devtool: 'eval-source-map' }),
  resolve: {
    extensions: ['.jsx', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: 'defaults'
                  }
                ],
                '@babel/preset-react'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.PRODUCTION': env.production || !env.development,
      'process.env.NAME': JSON.stringify(require('./package.json').name),
      'process.env.VERSION': JSON.stringify(require('./package.json').version)
    })
  ]
})

module.exports = webpackConfig
