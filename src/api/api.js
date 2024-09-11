import axios from "axios";
import { MainApi } from "./link";
import qs from "qs";

// 请求源地址
let prefix = window.location.origin;


// 创建一个 Axios 实例
const http = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // 设置基本的请求地址
    timeout: 5000, // 设置请求超时时间
    headers: {
        "Content-Type": 'application/json',
    },
});



// 添加请求拦截器
http.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        if (config.timeout !== 20000) {
            let x = config.data;
            if (x) {
                x = qs.parse(x);
            } else {
                x = {};
            }

            config.data = x;
        }
        // 这里可以添加一些请求拦截前的逻辑，比如添加请求头、处理请求参数等
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
http.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        let code = response.data.code * 1;
        let c = 0;
        switch (code) {
            case 400: // 登录失效
            case 404: // 登录失效
            case 401: // 登录失效
                c = 400;
                break;
            case 402: //
                c = 402;
                break;
            case 403: // 该账号审核中
                c = 403;
                break;
            case 405: // 该账号审核未通过
                c = 405;
                break;
            case 408: // 该账号已禁用
                c = 408;
                break;
            case 410: // token 已过期
                c = 410;
                break;
            default:
        }
        if (c > 0) {
            //   store.dispatch("setUserStatus", c);
        }
        return response.data;
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

// 封装 get 请求
function get(url, params, config = {}) {
    const api = { ...TouristApi, ...MainApi };
    const apiUrl = api[url];
    if (!apiUrl) {
        return Promise.reject(new Error("Invalid API url"));
    }
    return http.get(apiUrl, { params }, config);
}

// 封装 post 请求
function post(url, data, config = {}) {
    const api = { ...TouristApi, ...MainApi };
    const apiUrl = api[url];
    if (!apiUrl) {
        return Promise.reject(new Error("Invalid API url"));
    }
    return http.post(apiUrl, qs.stringify(data), config);
}

export default {
    get,
    post,
};
