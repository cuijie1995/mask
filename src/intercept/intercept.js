
import axios from "axios";
import router from '../router/index'


import Dialog from "vant/lib/dialog";
import "vant/lib/dialog/style";

axios.interceptors.response.use((response) => {
    // 对响应数据做点什么

    return response;
}, (err) => {


    if (err && err.response) {
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)'; break;
            case 401: err.message = '未授权，请重新登录(401)'; break;
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
    }

    if (err.message == '未授权，请重新登录(401)') {
        Dialog.confirm({
            title: '提示',
            message: "您还未登录，请先去登录",
        }).then(() => {
            localStorage.removeItem("loginToken")
            let currentUrl = encodeURIComponent("http://www.qqr.world/m/#/login");

            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb78fc8385b943fd8&redirect_uri=" + currentUrl +
                "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
        }).catch(() => {
            localStorage.removeItem("loginToken")
            router.push("/")
        });
    }
    return Promise.reject(err);
});