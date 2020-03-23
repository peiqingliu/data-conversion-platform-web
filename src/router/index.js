import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/store'
import NProgress from 'nprogress' //进度条
import 'nprogress/nprogress.css';
Vue.use(VueRouter);


// 路由懒加载
const getComponent = (name,component) => () => import(`@/views/${name}/${component}.vue`);

const routes = [
    {
      path: '/',
      redirect: '/home',
        component: () =>
            getComponent('home','index')
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
                component: import( /* webpackChunkName: "page" */ '../views/home/index'),
                meta:{title:'首页'}
            },
        ]
    }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


//判断是否存在token
router.beforeEach((to,from,next)=>{
    NProgress.start();
    if (to.path !== '/login' && !store.state.token) {
        next('/login');
        NProgress.done() // 结束Progress
    }
    next()
});
router.afterEach(() => {
    NProgress.done() // 结束Progress
});

export default router
