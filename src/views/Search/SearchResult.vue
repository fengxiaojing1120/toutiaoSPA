<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        class="search_result_title"
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <ArticleItem
        v-for="obj in articleList"
        :key="obj.art_id"
        :artObj="obj"
        :isShow="false"
        @click.native="itemClickFn(obj.art_id)"
      ></ArticleItem>
    </van-list>
  </div>
</template>

<script>
// 事件修饰符.native ->给组件内根标签，绑定原生click点击事件
import { searchResultAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
// 目标1：跳转到搜索结果页面
// 1.输入框回车 (输入文字，按下回车->搜索结果)
// 2.点击联想菜单搜索(点击文字->搜索结果页)
// 3.点击历史记录(点击文字 ->搜索结果)
export default {
  name: 'SearchResult',
  components: { ArticleItem },
  data () {
    return {
      page: 1,
      articleList: [], // 文章列表
      loading: false, // 加载状态
      finished: false // 是否加载完成
    }
  },
  async created () {
    const res = await searchResultAPI({
      page: this.page,
      // 路由传参
      q: this.$route.params.kw
    })
    console.log(res)
    this.articleList = res.data.data.results
  },
  methods: {
    // 加载方法
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultAPI({
          page: this.page,
          // 路由传参
          q: this.$route.params.kw
        })
        // console.log(res)
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      }
    },
    // 跳转到详情页
    itemClickFn (id) {
      this.$router.push({
        path: `/details?art_id=${id}`
      })
    }
  }

}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
.search_result_title {
  background-color: #07c160;
}
/deep/.van-nav-bar .van-icon {
  color: white;
}
/deep/.van-nav-bar__title {
  color: white;
}
</style>
