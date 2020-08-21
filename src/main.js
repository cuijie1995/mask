
import Vue from 'vue'
import App from './App'
import router from './router'

import $ from 'jquery'

import axios from 'axios'

import intercept from "./intercept/intercept";



import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)




import { NavBar, Icon, Row, Col, Popup, Tab, Tabs, DropdownMenu, DropdownItem ,NoticeBar,Cell,DatetimePicker} from 'vant';

Vue.use(NavBar).use(Icon).use(Row).use(Col).use(Popup).use(Tab).use(Tabs).use(DropdownMenu).use(DropdownItem).use(NoticeBar).use(Cell).use(DatetimePicker);

import './assets/icon/iconfont.css'


// Vue.prototype.url = 'http://192.168.0.196:8899';
// Vue.prototype.uploadurl = 'http://192.168.0.196:8898';
// Vue.prototype.pictureserverurl = 'http://192.168.0.196/';


// Vue.prototype.url = 'http://yun.witsoftware.cn:8899';
// Vue.prototype.uploadurl = 'http://yun.witsoftware.cn:8898';
// Vue.prototype.pictureserverurl = 'http://yun.witsoftware.cn/';


Vue.prototype.url = 'http://www.qqr.world:8899';
Vue.prototype.uploadurl = 'http://img.qqr.world:8898';
Vue.prototype.pictureserverurl = 'http://img.qqr.world:8880/';

// www.qqr.world:8899


Vue.config.productionTip = false
Vue.prototype.$axios = axios;





// //下边代码添加在main.js中
// axios.interceptors.response.use((request, next) => {
//   　console.log(this)//此处this为请求所在页面的Vue实例
//     // modify request
//     // request.method = 'POST';//在请求之前可以进行一些预处理和配置

//     // continue to next interceptor
//   　　next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法

//       　　response.body = '...';
//   　　　　return response;

//     });
//   });


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
