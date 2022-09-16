<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      :immediate-check="false"
      finished-text="没有更多了"
      @load="onLoad"
      offset="50"
    >
      <ArticleItem
      v-for="obj in list"
      :key="obj.art_id"
      @dislikeEV="dislikeFn"
      @reportEV="reportFn"
      :artObj="obj"
      @click.native="itemClickFn(obj.art_id)"
      >
      </ArticleItem>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { getAllArticlesAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import { Toast } from 'vant'// Notify,
export default {
  props: {
    // list: Array // 自定义属性 文章列表
    channelId: Number
  },
  data () {
    return {
      list: [],
      loading: false, // 底部加载状态
      finished: false, // 底部完成状态
      theTime: new Date().getTime(), // 用于分页
      isLoading: false // 顶部下拉刷新

    }
  },
  async created () {
    this.getArticleListFn()
  },
  methods: {
    async getArticleListFn () {
      const res = await getAllArticlesAPI({
        channel_id: this.channelId, // 先请求默认文章列表
        timestamp: this.theTime
      })
      // created()第一次list是空数组，合并空数组没问题
      this.list = [...this.list, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp
      this.loading = false // 关闭加载状态
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.isLoading = false
    },
    // 底部加载事件方法
    async onLoad () {
      // immediate-check=false:内部不要进行判断而已，监听滚动事件的代码还在
      // 第一个频道滚动到底部，再切换到第二个页面的时候，滚动会从底部滚回顶部
      // 这个时候发生了滚动，所以滚动事件还是发生了，immediate-check判断无效
      // 解决方案2
      if (this.list.length === 0) {
        this.loading = false
        return
      }
      this.getArticleListFn()
    },
    // 顶部下拉刷新
    async onRefresh () {
      // 将之前的内容清空
      this.list = []
      // 将时间重置为当前系统时间
      this.theTime = new Date().getTime()
      this.getArticleListFn()
    },
    async dislikeFn (id) {
      await dislikeArticleAPI({
        artId: id
      })
      Toast.success('反馈成功')
    },
    async reportFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      // Notify({ type: 'success', message: '反馈成功' })
      Toast.success('反馈成功')
    },
    // 跳转到详情页
    itemClickFn (id) {
      this.$router.push({
        path: `/details?art_id=${id}`
      })
    }

  },
  components: {
    ArticleItem
  }
}
</script>

<style></style>
<!-- 上拉加载 -->
<!--
  1.系统时间(timestamp)-> 后台 返回第0-9条数据 ->携带第10条的pre_timestamp值返回
  2.第二次的(timestamp)-就是上次的pre_timestamp（代表是从指定时间戳再往后找10个）10-19条，
  3.与上次的数据拼接成数组，并且此时返回了第20条的pre_timestamp
 -->
  <!-- 问题：页面一打开，created里的请求和onLoad里的请求同时发送，请求的都是最新数据
    onLoad中，2次一样的数据合并，数据重复，key重复了
    原因：van-list组件，组件挂载时，默认就会判定一次是否触底
    第一页数据也是网络请求回来的，标签先挂载了，数据回来更新DOM，所以标签没有高度，list的load事件上来就触发
   解决方案1：list组件添加 :immediate-check="false",初始化时不要判定
   解决方案2：在onLoad第一行，写数组长度的判断
   -->
