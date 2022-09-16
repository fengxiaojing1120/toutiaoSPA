// 在文件中封装3个方法->专门用于操作token的
// 封装的目的：代码分层，更方便、结构更清晰
const key = 'dafeng'
// 设置token
export const setToken = (token) => {
  localStorage.setItem(key, token)
}
// 获取token
export const getToken = () => localStorage.getItem(key)

// 移除token
export const removeToken = () => {
  localStorage.removeItem(key)
}
