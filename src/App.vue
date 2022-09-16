<template>
<!-- 004 挂载路由 -->
<div>
  <!-- keep-alive实现数据缓存，切换页面时不重新加载数据 -->
  <!-- 有些页面不需要缓存 -->
  <keep-alive exclude="Search,SearchResult,ArticleDetails,Login">
    <router-view></router-view>
  </keep-alive>

</div>
</template>

<script>

export default {

}
</script>

<style></style>
