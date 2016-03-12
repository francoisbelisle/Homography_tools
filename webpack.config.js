var path = require('path')

module.exports = {
  entry: './src/index',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    'google': true
  }
}
