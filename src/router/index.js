import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../Index.vue'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Search from '../views/Search.vue'
import Test from '../views/Test.vue'
import SelfInformation from '../views/SelfInformation.vue'
import Order from '../views/Order.vue'
import OrderDetails from '../views/OrderDetails.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Index,
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/selfInformation',
    name: 'SelfInformation',
    component: SelfInformation
  },
  {
    path: '/order',
    name: 'Order',
    component: Order
  },
  {
    path: '/orderDetails',
    name: 'OrderDetails',
    component: OrderDetails

  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    window.sessionStorage.clear();
    return next();
  }
  if (to.path === '/home') {
    return next();
  }
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  //无token强制跳转到登录页面
  if (!tokenStr) return next('/login');
  next();
})

export default router
