var webpack = require('webpack');
var common = require('./webpack.config.common.js')

module.exports = {
  // or devtool: 'eval' to debug issues with compiled output:
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: common.output,
  plugins: common.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]),
  module: common.module,
  postcss: common.postcss
};

