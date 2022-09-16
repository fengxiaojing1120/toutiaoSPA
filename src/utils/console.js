// .env.development
// .env.production
// 环境变量文件中，定义变量名NODE_ENV(固定)，BASE_URL(固定)，自定义变量名VUE_APP开头(规定)
// key名必须一致，写代码一套代码.key名，会自动匹配环境变量值
// 打包项目时，.env.production内变量挂载到process.env属性上
if (process.env.NODE_ENV === 'production') {
  console.log = function () {} // 覆盖所有打印语句
  console.warning = function () {}
  console.dir = function () {}
  console.error = function () {}
}
