var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');

var env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

var config = {
    dev: {
        devtool: 'eval',
        entry: [
            'webpack-dev-server/client?http://localhost:3001',
            'webpack/hot/only-dev-server',
            './src/main'
        ],
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'bundle.js',
            publicPath: 'http://localhost:3001/build'
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
        ],
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
    },
    prod: {
        devtool: 'sourc-map',
        entry: [
            './src/main'
        ],
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'bundle.js',
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        plugins: [
            new UglifyJsPlugin({ minimize: true })
        ],
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
    }
}

module.exports = config[env];
