const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    devServer: {
        "contentBase": "./",
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
};
