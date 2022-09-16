// 基于axios封装网络请求
// import router from '@/router'
import theAxios from 'axios'
import { Notify } from 'vant'
// import { getNewTokenAPI } from '@/api/index.js'
import { getToken, removeToken } from '@/utils/token.js' // setToken
import router from '@/router'
const axios = theAxios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 20000 // 响应超过20秒，判定为超时
})
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 目标：统一携带token
  // 判断本地有token携带，判断具体api/index.js里如果没有携带Authorization，再添加上去
  // ?.可选链操作符，如果前面对象里没有length，整个表达式原地返回underfined
  // 如果getToken()在原地有值token字符串，才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
// 本质是一个函数
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  console.dir(error)
  // 只有401代表身份过期，才需要跳转到登录页面
  if (error.response.status === 401) {
    Notify({ type: 'warning', message: '身份已过期' })
    // 不能使用this.$router(因为此时的this指向的不是vue组件对象，无法调用$router)
    // 解决：this.$router为了拿到router路由对象，可以直接引入@/router下的router对象
    removeToken() // 先清除token，才能让路由守卫放行
    // 方式1:强制跳转到登录页，用户有感知
    // router.currentRoute相当于在vue文件内this.$route ->当前路由对象
    // fullPath，路由对象里完整路由路径#后面的内容
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
  }
  // 方式2：使用refresh_token换回新的token再继续使用，用户无感知
  //   const res = await getNewTokenAPI()
  //   // 接收到新的token后，要做什么
  //   // 1.更新token保存在本地
  //   setToken(res.data.data.token)
  //   // 2.更新新的token在请求头里
  //   error.config.headers.Authorization = `Bears ${res.data.data.token}`
  //   // 3.未完成的这次请求，再一次发起
  //   // error.config就是上一次请求的配置对象
  //   // 然后要return回原本逻辑页面调用的地方
  //   return axios(error.config)
  // } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
  //   // 刷新的refresh——token也过期了
  //   localStorage.clear()
  //   Notify({ type: 'warning', message: '身份已过期' })
  //   router.replace('/login')

  return Promise.reject(error)
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
