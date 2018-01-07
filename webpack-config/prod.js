const webpackMerge = require('webpack-merge');
var path = require('path');
const base = require('./base');
const webpack = require('webpack');
//引入clean插件
var cleanWebpackPlugin = require('clean-webpack-plugin');

var extractTextPlugin = require('extract-text-webpack-plugin');
//初始化两个实例用于两处规则分别加载
var extractCSS = new extractTextPlugin('css/[name]-one.css');
var extractSCSS = new extractTextPlugin('css/[name]-two.css');

module.exports = webpackMerge(base, {

    output: {
        path: path.resolve(__dirname, './../dist'),//将输出路径定位到dist一级就好
        filename: 'js/[name]-[hash].js'//[hash]为编译时填写hash的占位符
    },
    module: {
        rules: [
            {
                test: /\.css$/,//匹配所有css文件
                //extractCSS实例对css进行操作
                use: extractCSS.extract([
                   // {loader: 'style-loader'},//style-loader不能喝插件一起使用
                    {loader: 'css-loader', options: {importLoaders: 1,minimize: true}},//importLoaders解决由于css-loader处理文件导入的方式导致postcss-loader不能正常使用的问题
                    {loader: 'postcss-loader'}//指定postcss加载器
                ]),//指定加载器
                // use: [
                //     {loader: 'style-loader'},
                //     {loader: 'css-loader', options: {importLoaders: 1}},//importLoaders解决由于css-loader处理文件导入的方式导致postcss-loader不能正常使用的问题
                //     {loader: 'postcss-loader'}//指定postcss加载器
                // ],//指定加载器
                exclude: /node_modules/ //排除对node_modules文件夹下面的所有资源的匹配
            },{
                test: /\.scss$/,//处理scss文件
                use: extractSCSS.extract([
                   // {loader: 'style-loader'},
                    {loader: 'css-loader', options: {importLoaders: 1,minimize: true}},
                    {loader: 'postcss-loader'},
                    {loader: 'sass-loader'}//sass,放在最后最先加载
                ]),
                // use: [
                //     {loader: 'style-loader'},
                //     {loader: 'css-loader', options: {importLoaders: 1}},
                //     {loader: 'postcss-loader'},
                //     {loader: 'sass-loader'}//sass,放在最后最先加载
                // ],
                exclude: /node_modules/
            },
        ]
    },
  plugins: [
      //注册插件
      extractCSS,
      extractSCSS,
      //启用js压缩
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: false
        },
        sourceMap: true,//这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
    }),
    new cleanWebpackPlugin(
        ['dist'],//匹配要删除的文件
        {
            root: __dirname,//指定插件根目录的位置
            verbose: false, //开启在控制台输出信息
            dry: false //启用删除文件
        }
    )
  ]
});