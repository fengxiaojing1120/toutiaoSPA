
<!-- 002 在页面中导入组件 -->
<template>
<div>
  <van-nav-bar
  title="明日头条-登录"
/>
<div>
  <!-- 1.输入框的form属性=‘用户名’
  表单整体提交时，默认收集一个提交对象
  往后台发送的参数名就是name值
  {"用户名"：'页面值'}
  2.label属性输入框左侧文本
  3.rules属性配置检验规则
  :属性名='表达式'
  属性名='字符串'
  -->
<van-form @submit="onSubmit">
  <van-cell-group inset>
    <van-field
      v-model="user.mobile"
      required
      name="手机号"
      label="手机号"
      placeholder="请输入11位手机号"
      :rules="[{ required: true, message: '请填写正确手机号', pattern:/^1[3-9]\d{9}$/}]"
    />
    <van-field
      v-model="user.code"
      type="password"
      required
      name="密码"
      label="密码"
      placeholder="请输入6位密码"
      :rules="[{ required: true, message: '请填写密码' , pattern:/^\d{6}$/}]"
    />
  </van-cell-group>
  <div style="margin: 16px;">
  <!-- round表示是否为圆形，默认为true
  block代表块级元素
  type表示按钮类型
  native-type代表原生button的type属性

  -->
    <van-button round block type="primary" native-type="submit"
   :disabled ="isLoading " :loading="isLoading" loading-text="登录中" >
      登录
    </van-button>
  </div>
</van-form>
</div>

</div>
</template>

<script>
// 写需求套路
// 1.html+css
// 2.数据铺设，数据绑定，数据微调
// 3.js交互-事件、正则

// 组件使用套路
// 找组件、引组件、用组件，读，删，改

// 目标1：实现顶部导航->自定义样式
// 目标2：实现表单组件->读，改，加
// 目标3：收集值以后，调用接口->查看登录结果
// 目标4：点击登录后给用户提示（正在登录中）
import { loginAPI } from '@/api'
import { Notify } from 'vant'
import { setToken } from '@/utils/token.js'
import { setStorage } from '@/utils/storage.js'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '',
        code: ''// 验证码必须是246810
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      console.log('submit', values)
      console.log(this.user)
      this.isLoading = true

      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'primary', message: '登录成功' })
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 登录成功后跳转到首页
        this.$router.replace(
          {
            path: this.$route.query.path || '/layout/home'// 如果登录前有未完成的地址，则在登录成功后会跳转到该页面
          }
        )
      } catch (err) {
        // promise内ajax抛出错误，直接进入这里
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoading = false // 网络请求完成，无论成功/报错，把状态关掉
    }
  }

}
</script>

<style scoped lang="less">
.van-nav-bar{
  background-color: #07c160;
}
/* 此选择器名字是van-nav-bar组件内标签
scoped尝试把此选择器后属性选择择器匹配当前页面标签（选不中组件内部的） */
// /deep/会把属性选择器加到前面
/deep/ .van-nav-bar__title{
  color: white;
}
// lang="less"表示当前style标签是less语法
</style>
