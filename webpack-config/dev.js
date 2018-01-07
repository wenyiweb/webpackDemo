const webpackMerge = require('webpack-merge');
const base = require('./base');
module.exports = webpackMerge(base, {
output: {
   // path: path.resolve(__dirname, './dist'),//将输出路径定位到dist一级就好
    filename: '[name].js'//[hash]为编译时填写hash的占位符
},
module: {
    rules: [
        {
            test: /\.css$/,//匹配所有css文件
            use: [
                {loader: 'style-loader'},
                {loader: 'css-loader', options: {importLoaders: 1}},//importLoaders解决由于css-loader处理文件导入的方式导致postcss-loader不能正常使用的问题
                {loader: 'postcss-loader'}//指定postcss加载器
            ],//指定加载器
            exclude: /node_modules/ //排除对node_modules文件夹下面的所有资源的匹配
        },{
            test: /\.scss$/,//处理scss文件
            use: [
                {loader: 'style-loader'},
                {loader: 'css-loader', options: {importLoaders: 1}},
                {loader: 'postcss-loader'},
                {loader: 'sass-loader'}//sass,放在最后最先加载
            ],
            exclude: /node_modules/
        },
    ]
},
  devtool: 'eval-source-map',
  devServer: {
      port: 3000,
      inline: true//iframe模式，页面放在iframe中,当发生改变时重载
      //inline模式，将webpack-dev-sever的客户端入口添加到包(bundle)中
      
  }
});