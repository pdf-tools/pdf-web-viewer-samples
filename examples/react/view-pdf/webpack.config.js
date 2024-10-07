const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: ''
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            envName: 'development'
          }
        }
      }
    ]
  },
  devServer: {
    allowedHosts: 'all'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/@pdftools/pdf-web-viewer/pdftools-web-viewer',
          to: 'pdftools-web-viewer'
        }
      ]
    })
  ]
};
