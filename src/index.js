/**
 * @file index.js
 * @author wangxiaobo05(@baidu.com)
 * @email wangxiaobo05(@baidu.com)
 * @create date 2020-07-20 10:39:10
 * @modify date 2020-07-20 10:39:10
 */
import swURL from 'service-worker:../sw/index.js';

navigator.serviceWorker.register(swURL);
