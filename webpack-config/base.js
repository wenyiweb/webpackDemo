//path模块是nodejs内置的处理路径相关的模块
var path = require('path');
var webpack = require('webpack');
//引入html-webpack-plugin模块
var htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    // resolve: {
    //     extensions: ['.js'],
    //     alias: {
    //       src: path.resolve(__dirname, './../src')
    //     }
    //   }
    //使用path.resolve()是为了确保路径从根目录开始绝对定位到指定位置
    entry: {
        'app': path.resolve(__dirname, './../src/js/app.js'),
        'b': path.resolve(__dirname, './../src/js/b.js'),
        'c': path.resolve(__dirname, './../src/js/c.js'),
    },
    module: {
        //webpack中的loader的解析是从右往左进行的
        rules: [{
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
        new webpack.optimize.CommonsChunkPlugin({
            name:"common",
            filename:"js/[name].js",//忽略则以name为输出文件的名字，否则以此为输出文件名字
           minChunks:2,
           //chunks: ['app']
        }),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './../src/index.html'),
            filename: 'index.html',
            title: 'this is index.html',
            chunks: ['app','common']
        }),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './../src/a.html'),
            filename: 'a.html',
            title: 'this is a.html',
            chunks: ['b','common']
        }),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './../src/b.html'),
            filename: 'b.html',
            title: 'this is b.html',
            chunks: ['c','common']
        }),
        // new htmlWebpackPlugin({
        //     template: 'index.html',//定义插件读取的模板文件是根目录下的index.html
        //     filename: 'index.html'//定义通过模板文件新生成的页面名称
        // }),
        
    ]
}


