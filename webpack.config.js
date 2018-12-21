const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    cache: true,
    entry: './src/index.js',
    devServer: {
        "contentBase": "./",
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([
            path.resolve( __dirname, './node_modules/' )
        ]),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        pathinfo: false
    },
    module: {
        rules: [{
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        }],
    },
    optimization: {
        minimizer: [new UglifyJsPlugin({
            test: /\.js($|\?)/i,
            sourceMap: true,
            uglifyOptions: {
                mangle: {
                    keep_fnames: true,
                },
                compress: {
                    warnings: false,
                },
                output: {
                    beautify: false,
                },
            }
        })]
    }
};
