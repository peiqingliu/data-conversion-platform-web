import axios from "axios";
import router from "../router/router";
import {serialize} from '../util/util'
import {
    Loading
} from "element-ui";
import {Message} from 'element-ui'
import store from '../store/store';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
axios.defaults.timeout = 60000;
// axios.defaults.baseURL = process.env.BASE_URL;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// axios.defaults.headers.post["Content-Type"] =
//     "application/x-www-form-urlencoded;charset=UTF-8";
let loading = null;
//跨域请求，允许保存cookie
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});
/*
 *请求前拦截
 *用于处理需要请求前的操作
 */
axios.interceptors.request.use(
    config => {
        // loading = Loading.service({
        //     text: "正在加载中......",
        //     fullscreen: true
        // });
        NProgress.start(); // start progress bar
        const meta = (config.meta || {});
        if (store.state.token) {
            config.headers["Authorization"] = "Bearer " + store.state.token;
        }
        //headers中配置serialize为true开启序列化
        if (config.method === 'post' && meta.isSerialize === true) {
            config.data = serialize(config.data);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
/*
 *请求响应拦截
 *用于处理数据返回后的操作
 */
axios.interceptors.response.use(
    res => {
        NProgress.done();
        const status = res.data.code || 200;
        const message = res.data.message || '未知错误';
        //如果是403则跳转到登录页面(登录失效)
        if (status === 403) store.dispatch('FedLogOut').then(() => router.push({path: '/login'}));
        // 如果请求为非200否者默认统一处理
        if (status !== 200) {
            Message({
                message: message,
                type: 'error'
            });
            return Promise.reject(new Error(message))
        }
        return res.data;
    },
    error => {
        console.log(error)
        //请求成功后关闭加载框
        if (loading) {
            loading.close();
        }
        //断网处理或者请求超时
        if (!error.response) {
            //请求超时
            if (error.message.includes("timeout")) {
                console.log("超时了");
                messages("error", "请求超时，请检查互联网连接");
            } else {
                //断网，可以展示断网组件
                console.log("断网了");
                messages("error", "请检查网络是否已连接");
            }
            return;
        }
        const status = error.response.status;
        switch (status) {
            case 500:
                messages("error", "服务器内部错误");
                break;
            case 404:
                messages(
                    "error",
                    "未找到远程服务器"
                );
                break;
            case 401:
                messages("warning", "用户登陆过期，请重新登陆");
                localStorage.removeItem("token");
                setTimeout(() => {
                    router.replace({
                        path: "/login",
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                }, 1000);
                break;
            case 400:
                messages("error", "请求数据数据异常");
                break;
            default:
                messages("error", error.response.data.message);
        }
        return Promise.reject(error);
    }
);
/*
 *get方法，对应get请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}
/*
 *post方法，对应post请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}