/**
 * @file index.js
 * @author wangxiaobo05(@baidu.com)
 * @email wangxiaobo05(@baidu.com)
 * @create date 2020-07-20 15:52:58
 * @modify date 2020-07-20 15:52:58
 */
const {createHash} = require('crypto'); 
const {ConcatSource} = require('webpack-sources');
const RawModule = require('webpack/lib/RawModule');
const WorkerTemplate = require('webpack/lib/webworker/WebWorkerTemplatePlugin');
const SingleEntry = require('webpack/lib/SingleEntryPlugin');

const NAME = 'service-worker';
const importPrefix = 'service-worker:';

function compileSw(compilation, entry, output, callback) {
    const opts = {filename: output};
    const compiler = compilation.createChildCompiler(NAME, opts, []);
    new WorkerTemplate().apply(compiler);
    new SingleEntry(null, entry, 'sw').apply(compiler);
    compiler.runAsChild((err, entries, compilation) => {
        callback(err, compilation.assets[output]);
    });
}
// webpack core modules are classes
module.exports = class SWPlugin {
    constructor({
        output = 'sw.js',
        filterAssets = () => true
    }) {
        this.output = output;
        this.filter = filterAssets;
    }
    apply(compiler) {
        // normal module are source module
        compiler.hooks.normalModuleFactory.tap(NAME, factory => {
            factory.hooks.resolver.tap(NAME, resolve => {
                return (dep, callback) => {
                    this.resolveId(dep, resolve, callback);
                };
            });
        });

        compiler.hooks.emit.tapAsync(NAME, this.emit.bind(this));
    }
    resolveId(dep, resolve, callback) {
        const isSw = dep.request.startsWith(importPrefix);
        if (!isSw) return resolve(dep, callback);
        dep.request = dep.request.slice(importPrefix.length);
        resolve(dep, (err, dep) => {
            if (err) return callback(err);
            this.sw = dep.request;
            const url = JSON.stringify(this.output);
            const code = `module.exports = __webpack_public_path__ + ${url}`;
            callback(null, new RawModule(code));
        });
    }
    emit(compilation, callback) {
        const assets = Object.keys(compilation.assets).filter(this.filter);
        const versionHash = createHash('sha1');
        for (const file of assets) {
            versionHash.update(compilation.assets[file].source());
        }
        const version = versionHash.digest('hex');
        const publicPath = compilation.outputOptions.publich || '/';
        const assetsUrls = assets.map(file => publicPath + file.replace(/((^|\/)index)?\.html?$/, '$2') || '.');
        compileSw(compilation, this.sw, this.output, (err, swAsset) => {
            if (err) return callback(err);
            const assets = new ConcatSource(
                `const VERSION = ${JSON.stringify(version)};\n`,
                `const ASSETS = ${JSON.stringify(assetsUrls)}\n`,
                swAsset.source()
            );
            compilation.assets[this.output] = assets;
            callback();
        });
    }
};
