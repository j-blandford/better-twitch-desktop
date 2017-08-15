const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',
    },
    resolve: {
        modules: [
            "node_modules"
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        })
    ],
    output: {
        filename: '[name].js',
        library: 'ffz-desktop',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        path: path.resolve(__dirname, '../build')
    }
}