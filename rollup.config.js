/**
 * @file index.js
 * @author wangxiaobo05(@baidu.com)
 * @email wangxiaobo05(@baidu.com)
 * @create date 2020-07-20 11:02:18
 * @modify date 2020-07-20 11:02:18
 */
import serviceWorkerPlugin from './lib/rollup-sw-plugin.js';

export default {
    input: ['src/index.js'],
    output: {
        dir: 'rollupBuild'
    },
    plugins: [
        // ...otherPlugins,
        serviceWorkerPlugin()
    ]
};
