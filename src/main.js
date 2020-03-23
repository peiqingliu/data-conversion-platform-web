import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './plugins/element.js'
import './assets/css/normalize.css'
import './assets/css/public.css'
import '@/element-variables.scss'
import Element from 'element-ui';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';

import basicContainer from './components/basic-container/main';
// import './assets/scss/global.scss'
// 引入字体文件
import '@/assets/icon/iconfont.css';
Vue.use(Element);
Vue.use(Avue);
Vue.config.productionTip = false;
//注册全局容器
Vue.component('basicContainer', basicContainer);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
