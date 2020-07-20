/**
 * @file index.js
 * @author wangxiaobo05(@baidu.com)
 * @email wangxiaobo05(@baidu.com)
 * @create date 2020-07-20 15:38:35
 * @modify date 2020-07-20 15:38:35
 */
const path = require('path');
const ServiceWorkerPlugin = require('./lib/webpack-sw-plugin.js');

const swPlugin = new ServiceWorkerPlugin({});
module.exports = {
    entry: 'src/index.js',
    output: {
        path: path.resolve(__dirname, 'webpackBuild')
    },
    plugins: [
        swPlugin
    ]
};
