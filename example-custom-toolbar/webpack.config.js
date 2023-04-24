const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webViewerNodeModluesDir = path.dirname(
  require.resolve('@pdf-tools/four-heights-pdf-web-viewer')
)

const webViewerAssetsDir = path.join(webViewerNodeModluesDir, '../pdfwebviewer')
const webViewerDocDir = path.join(webViewerNodeModluesDir, '../doc')

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    allowedHosts: 'all',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '*.pdf',
          to: './',
          context: webViewerDocDir,
        },
        {
          from: '**/*',
          to: 'pdfwebviewer',
          context: webViewerAssetsDir,
        },
      ],
    }),
  ],
}
