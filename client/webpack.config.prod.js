require('dotenv').config({
    path: '../.env'
});
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, './src/app.js'),
    devtool: 'inline-source-map',
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions:{
                    mangle: false
                }
            })
        ],
    },
    devServer: {
        contentBase: './dist',
        historyApiFallback: true
    },
    module: {
        rules: [
            { test: /\.html$/, use: ["html-loader"] },
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: path.resolve(__dirname, './src/index.html'),
            inject: 'head'
        }),
        new webpack.DefinePlugin({
            'process.env.APP_ID': JSON.stringify(process.env.APP_ID),
        })
    ],
};