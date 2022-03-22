const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve('dist'),
    libraryTarget: 'commonjs2',
    publicPath: '/react-polkadon',
  },
});
