//path模块是nodejs内置的处理路径相关的模块
var path = require('path');
var webpack = require('webpack');
//引入html-webpack-plugin模块
var htmlWebpackPlugin = require('html-webpack-plugin');
//引入clean插件
var cleanWebpackPlugin = require('clean-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');
//初始化两个实例用于两处规则分别加载
var extractCSS = new extractTextPlugin('css/[name]-one.css');
var extractSCSS = new extractTextPlugin('css/[name]-two.css');
module.exports = {
    //使用path.resolve()是为了确保路径从根目录开始绝对定位到指定位置
    entry: {
        'app': path.resolve(__dirname, './src/js/app.js'),
        'b': path.resolve(__dirname, './src/js/b.js'),
        'c': path.resolve(__dirname, './src/js/c.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),//将输出路径定位到dist一级就好
        filename: 'js/[name].js'//[hash]为编译时填写hash的占位符
    },
    module: {
        //webpack中的loader的解析是从右往左进行的
        rules: [{
            test: /\.css$/,//匹配所有css文件
            //extractCSS实例对css进行操作
            use: extractCSS.extract([
               // {loader: 'style-loader'},//style-loader不能喝插件一起使用
                {loader: 'css-loader', options: {importLoaders: 1}},//importLoaders解决由于css-loader处理文件导入的方式导致postcss-loader不能正常使用的问题
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
                {loader: 'css-loader', options: {importLoaders: 1}},
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
        },{
            test: /\.js$/,//编译js
            use: [{loader: 'babel-loader', options: {
                cacheDirectory: true
            }}],
            exclude: /node_modules/,
            include: /src/
        },/**{
            test: /\.(png|jpg|gif|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[hash].[ext]',
                    outputPath: '/assets/',//定义图片输出存放的文件夹位置
                    useRelativePath: true,//设置路径为相对位置
                }
            }],
            exclude: /node_modules/
        },*/{
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [{
                loader: 'image-webpack-loader',//新增image-webpack-loader
                options: {
                    mozjpeg: {//设置对jpg格式的图片压缩的程度
                        progressive: true,
                        quality: 90
                    },
                    pngquant:{
                        quality: "65-90",
                        speed: 4
                    },
                }
            },{
                loader: 'url-loader',
                options: {
                    limit: 10240,
                    outputPath: 'assets/',
                    useRelativePath: true
                }
            }],
            exclude: /node_modules/
        }]
    },
    //插件初始化
    plugins: [
        //注册插件
        extractCSS,
        extractSCSS,
        //启用js压缩
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //         drop_console: false
        //     },
        //     sourceMap: true,//这里的soucemap 不能少，可以在线上生成soucemap文件，便于调试
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name:"common",
            filename:"js/[name].js",//忽略则以name为输出文件的名字，否则以此为输出文件名字
           minChunks:2,
           //chunks: ['app']
        }),
        new htmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            title: 'this is index.html',
            chunks: ['app','common']
        }),
        new htmlWebpackPlugin({
            template: './src/a.html',
            filename: 'a.html',
            title: 'this is a.html',
            chunks: ['b','common']
        }),
        new htmlWebpackPlugin({
            template: './src/b.html',
            filename: 'b.html',
            title: 'this is b.html',
            chunks: ['c','common']
        }),
        // new htmlWebpackPlugin({
        //     template: 'index.html',//定义插件读取的模板文件是根目录下的index.html
        //     filename: 'index.html'//定义通过模板文件新生成的页面名称
        // }),
        new cleanWebpackPlugin(
            ['dist'],//匹配要删除的文件
            {
                root: __dirname,//指定插件根目录的位置
                verbose: false, //开启在控制台输出信息
                dry: false //启用删除文件
            }
        )
    ],
    devServer: {
        port: 3000,
        inline: true//iframe模式，页面放在iframe中,当发生改变时重载
        //inline模式，将webpack-dev-sever的客户端入口添加到包(bundle)中
        
    }
}


