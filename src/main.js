import Vue from 'vue'
import App from './App.vue'
import '@/utils/console.js'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入flexible.js -> 设置根标签字体大小(实现移动端适配)
import 'vant/lib/index.css'
import 'highlight.js/styles/default.css'
import directiveObj from './utils/directive'
import './VueComponent.js'

Vue.use(directiveObj)// 执行目标对象里install方法并传入Vue类
// ------------------
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
