var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');

var isDev = process.env.NODE_ENV !== 'production';
var entry = ['./src/main'];
var output = {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
};
var plugins = [new UglifyJsPlugin({ minimize: true })];

if(isDev) {
    entry = [
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/only-dev-server',
        './src/main'
    ];
    output.publicPath = 'http://localhost:3001/build';
    plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new UglifyJsPlugin({ minimize: true })
    ]
}

var config = {
    devtool: 'eval',
    entry: entry,
    output: output,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: plugins,
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['react-hot', 'babel'],
            include: path.join(__dirname, 'src')
        }, {
            test: /\.scss$/,
            loader: 'style!css!sass'
        }]
    }
};

module.exports = config;
