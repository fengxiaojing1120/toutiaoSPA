<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 加载中 -->
    <van-loading size="24px" color="#07c16" v-if="Object.keys(artObj).length===0">加载中...</van-loading>
    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ artObj.title }}</h1>

        <!-- 用户信息 -->
        <van-cell
          center
          :title="artObj.aut_name"
          :label="formateDate(artObj.pubdate)"
        >
          <template #icon>
            <img :src="artObj.aut_photo" alt="" class="avatar" />
          </template>
          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                v-if="artObj.is_followed === true"
                @click="followedFn(true)"
                >已关注</van-button
              >
              <van-button
                icon="plus"
                type="info"
                size="mini"
                plain
                v-else
                @click="followedFn(false)"
                >关注</van-button
              >
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            v-if="artObj.attitude === 1"
            @click="loveFn(true)"
            >已点赞</van-button
          >
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            v-else
            @click="loveFn(false)"
            >点赞</van-button
          >
        </div>
      </div>

      <!-- 用户评论区域 -->
      <div>
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import {
  detailAPI,
  userUnFollowedAPI,
  userFollowedAPI,
  likeArticleAPI,
  unLikeArticleAPI
} from '@/api'
import { timeAgo } from '@/utils/date.js'
import CommentList from '@/views/ArticleDetails/CommentList.vue'
export default {
  name: 'ArticleDetails',
  components: { CommentList },
  data () {
    return {
      artObj: {}
    }
  },
  async created () {
    const res = await detailAPI({
      artId: this.$route.query.art_id
    })
    console.log(res)
    this.artObj = res.data.data
  },
  methods: {
    formateDate: timeAgo,
    // 关注/取消关注作者
    async followedFn (bool) {
      if (bool === true) {
        // 点击已关注按钮，调用取消关注接口
        this.artObj.is_followed = false
        const res = await userUnFollowedAPI({
          userId: this.artObj.aut_id
        })
        console.log(res)
      } else {
        // 点击关注按钮，调用关注接口
        this.artObj.is_followed = true
        const res = await userFollowedAPI({
          userId: this.artObj.aut_id
        })
        console.log(res)
      }
    },
    // 点赞/取消点赞文章
    async loveFn (bool) {
      if (bool === true) {
        // 用户点击了已点赞按钮，取消点赞
        this.artObj.attitude = -1 // 0是不喜欢，-1是无态度
        const res = await unLikeArticleAPI({
          artId: this.artObj.art_id
        })
        console.log(res)
      } else {
        // 用户点击了点赞按钮
        this.artObj.attitude = 1
        const res = await likeArticleAPI({
          artId: this.artObj.art_id
        })
        console.log(res)
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 20px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
// 加载中的样式
.van-loading {
  text-align: center;
  padding-top:50px;

}
</style>
