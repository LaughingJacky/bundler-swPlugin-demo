/**
 * @file index.js
 * @author wangxiaobo05(@baidu.com)
 * @email wangxiaobo05(@baidu.com)
 * @create date 2020-07-20 11:04:07
 * @modify date 2020-07-20 11:04:07
 */

/**
 * {
 *      type: 'chunk',
 *      fileName: 'sw.js',
 *      code: '...',
 *      facadeModuleId: '/Users/username/demo/src/sw.js',
 *      dynamicImports: [...],
 *      exports: [],
 *      imports: [...],
 *      isDynamicEntry: false,
 *      isEntry: true,
 *      map: null,
 *      modules: {...}
 * }
 */
import {posix} from 'path';
import {createHash} from 'crypto';

const importPrefix = 'service-worker:';

export default function serviceWorkerPlugin({
    output = 'sw.js',
    filterAssets = () => true
} = {}) {
    return {
        name: 'service-worker',
        async resolveId(id, importer) {
            if (!id.startsWith(importPrefix)) return;
            const plainId = id.slice(importPrefix.length);
            const result = await this.resolve(plainId, importer);
            if (!result) return;
            return importPrefix + result.id;
        },
        load(id) {
            if (!id.startsWith(importPrefix)) return;
            const fileId = this.emitFile({
                type: 'chunk',
                id: id.slice(importPrefix.length),
                fileName: output
            });
            return `export default import.meta.ROLLUP_FILE_URL_${
                fileId
            }`;
        },
        generateBundle(options, bundle) {
            const swChunk = bundle[output];
            const toCacheInSW = Object.values(bundle).filter(
                item => item !== swChunk && filterAssets(item)
            );
            const urls = toCacheInSW.map(item =>
                posix.relative(posix.dirname(output), item.fileName)
                    .replace(/((?<=^|\/)index)?\.html?$/, '.')
            );
            const versionHash = createHash('sha1');
            for (const item of toCacheInSW) {
                versionHash.update(item.code || item.source);
            }
            const version = versionHash.digest('hex');
            swChunk.code
                = `const ASSETS = ${JSON.stringify(urls)};\n`
                    + `const VERSION = ${JSON.stringify(version)};\n`
                    + swChunk.code;
        }
    };
}
