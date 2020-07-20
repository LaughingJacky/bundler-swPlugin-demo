/**
 * @file index.js
 * @author wangxiaobo05(@baidu.com)
 * @email wangxiaobo05(@baidu.com)
 * @create date 2020-07-20 10:40:46
 * @modify date 2020-07-20 10:40:46
 */
const staticCache = `static-${VERSION}`;
addEventListener('install', e => {
    e.waitUntil((async () => {
        const cache = await caches.open(staticCache);
        await cache.addAll(ASSETS);
    })());
});
