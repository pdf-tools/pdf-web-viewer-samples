const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const pdfwebviewerDir = path.join(
  path.dirname(require.resolve('@pdf-tools/four-heights-pdf-web-viewer')),
  '../pdfwebviewer'
)

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '',
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
            envName: 'development',
          },
        },
      },
    ],
  },
  devServer: {
    port: 2214,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          to: 'pdfwebviewer',
          context: pdfwebviewerDir,
        },
        {
          from: '**/*',
          to: './',
          context: 'static',
        },
      ],
    }),
  ],
}
