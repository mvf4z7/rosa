var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  contentBase: __dirname,
  publicPath: config.output.publicPath,
  hot: true,
  quiet: false,
  noInfo: false,
  historyApiFallback: true
}).listen(3001, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Dev server listening at localhost:3001');
});
