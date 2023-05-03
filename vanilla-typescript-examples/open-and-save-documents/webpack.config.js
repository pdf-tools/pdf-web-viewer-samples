const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webViewerNodeModluesDir = path.dirname(
  require.resolve('@pdf-tools/four-heights-pdf-web-viewer')
)

const webViewerAssetsDir = path.join(webViewerNodeModluesDir, '../pdfwebviewer')
const webViewerDocDir = path.join(webViewerNodeModluesDir, '../doc')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.post('/upload', (req, res) => {
        console.log('file uploaded')
        res.json({ status: 'ok' })
      })
      return middlewares
    },
    allowedHosts: 'all'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '*.pdf',
          to: './',
          context: webViewerDocDir
        },
        {
          from: '**/*',
          to: 'pdfwebviewer',
          context: webViewerAssetsDir
        }
      ]
    })
  ]
}
