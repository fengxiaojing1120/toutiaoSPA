<template>
  <div>
    <div class="home_container">
      <!-- 二级路由页面 -->
      <!-- 为了防止二级路由页面的内容被底部导航挡住，特意将二级路由用类名为
        home_container的div标签包住 -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>

    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/layout/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const active = ref(0)
    return { active }
  }
}
</script>

<style></style>
