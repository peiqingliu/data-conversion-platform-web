
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets',resolve('src/assets'));
        //设置别名
        const entry = config.entry('app');
        entry
            .add('babel-polyfill')
            .end();
        entry
            .add('classlist-polyfill')
            .end();
    },

    devServer: {
        host: '127.0.0.1',
        port: 8088,
        proxy: {
            '/': {
                //本地服务接口地址
                target: 'http://localhost:8089',
                ws: true
            }
        }
    },    //定义scss全局变量
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/scss/global.scss";`
            }
        }
    }

};