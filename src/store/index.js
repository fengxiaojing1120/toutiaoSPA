import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // state用来存放数据源
  state: {
    // 头像默认地址
    userPhoto: 'https://ts1.cn.mm.bing.net/th?id=OIP-C.TQcBnO20xnfq0rGqNdZdJQAAAA&w=99&h=100&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2',
    userName: 'Dafeng'
  },
  // 对数据源进行加工，返回需要的数据
  getters: {
  },

  // 操作结束后，actions通过commit更新state数据源
  mutations: {
    // 编码风格，mutations最好大写
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    },
    SET_USERNAME (state, value) {
      state.userName = value
    }
  },
  // 执行的操作： 异步或同步事件
  actions: {
  },
  modules: {
  }
})
