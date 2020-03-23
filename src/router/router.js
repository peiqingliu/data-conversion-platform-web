import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
import NProgress from 'nprogress' //进度条
import 'nprogress/nprogress.css' 
Vue.use(Router)
// 路由懒加载
const getComponent = (name,component) => () => import(`@/views/${name}/${component}.vue`);
const myRouter=new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: getComponent('login','index')
    },
    {
      path: '/login',
      name: 'login',
      component: getComponent('login','index')
    },
    {
      path: '/',
      component:getComponent('layout','Layout'),
      children:[
          {
            path:'/home',
            name:'home',
            component: getComponent('home','index'),
            meta:{title:'首页'}
          },
          {
            path:'/interfaceManage',
            component: () => import(`@/views/system/interfaceManage/index.vue`),
            name:'interfaceManage',
            meta:{title:'接口管理'}
          },
          {
            path:'/dict',
            component: () => import(`@/views/system/dict/index.vue`),
            name:'dict',
            meta:{title:'接口管理'}
          }
      ]
    }
  ]
});
//判断是否存在token
myRouter.beforeEach((to,from,next)=>{
  NProgress.start();
  if (to.path !== '/login' && !store.state.token) {
     next('/login');
     NProgress.done() // 结束Progress
  }
  next()
});
myRouter.afterEach(() => {
  NProgress.done() // 结束Progress
});
export default myRouter