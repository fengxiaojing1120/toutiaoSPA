import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token.js'
// 003配置路由
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User/user.vue'
// import Search from '@/views/Search/search.vue'
// import SearchResult from '@/views/Search/SearchResult.vue'
// import ArticleDetails from '@/views/ArticleDetails/ArticleDetails.vue'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Chat from '@/views/Chat/Chat.vue'
// 总结：
// 路由懒加载：为了让第一个页面，加载的app.js小一点，打开网页快一点
// 思路：把组件对应js，分成若干个.js文件，路由切换到哪个页面，才去加载对应的.js文件
// 原因：webpack分析入口时，发现router里上来就import所有页面，所以直接打包进app.js
// 解决：当路由路径匹配规则时，才去import引入对应的组件js文件
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认导航到首页
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
        meta: {
          scrollT: 0 // 保存首页离开时，滚动条的位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User/user.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search/search.vue')
  },
  {
    path: '/search_result/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult.vue')
  },
  {
    path: '/details',
    component: () => import(/* webpackChunkName: "Details" */ '@/views/ArticleDetails/ArticleDetails.vue')

  },
  // 用户编辑页面
  {
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit.vue')
  },
  // YoYo同学
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat/Chat.vue')
  }
]

const router = new VueRouter({
  routes
})

// 路由--全局前置守卫(在路由跳转之前，执行此函数)
// 此函数可以决定路由是否跳转/取消/强制中断切换到别的路由
router.beforeEach((to, from, next) => {
  // 如果已经登录了，不要切换到登录页面
  if (getToken()?.length > 0 && to.path === '/login') {
    // next(false) // 留在原地
    // 想要去登录页，则不留在原地，而是返回首页
    next('/layout/home')
  } else {
    next()
  }
})

export default router
