<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userPhoto" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{$store.state.userName}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#07c160">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userObj.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to='/user_edit'/>
      <van-cell icon="chat-o" title="YoYo同学" is-link to='/chat'/>
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn" />

    </van-cell-group>
  </div>
</template>

<script>
import { userInfoAPI } from '@/api/index.js'
import { removeToken } from '@/utils/token.js'
import { Dialog } from 'vant'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      userObj: {},
      show: false
    }
  },
  async created () {
    // 获取用户信息
    const res = await userInfoAPI()
    console.log(res)
    this.userObj = res.data.data
    // 方法一：直接使用
    // this.$store.commit('SET_USERPHOTO', this.userObj.photo)
    // 方法二:映射的方法
    this.SET_USERPHOTO(this.userObj.photo)
    this.SET_USERNAME(this.userObj.name)
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),

    // 退出登录
    quitFn () {
      Dialog.confirm({
        title: '是否确定退出',
        message: '不考虑一下吗？'
      }).then(() => { // 用户点击确认
        removeToken()
        this.$router.replace('/login')
      }).catch(() => { // 用户点击取消
        // on cancel
      })
    }

  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #07c160;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #07c160;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 120px;
    height: 120px;
    background-color: #fff;
  }

</style>
