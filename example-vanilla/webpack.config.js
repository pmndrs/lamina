const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, './src/main.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      three: path.resolve(__dirname, './node_modules/three'),
      'lamina/vanilla': path.resolve(__dirname, '../src/vanilla.ts'),
    },
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
  },
  mode: 'development',
}
