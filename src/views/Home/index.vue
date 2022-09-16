<template>
  <div>
    <div>
      <van-nav-bar fixed>
        <template #left>
          <img class="logo" src="@/assets/logo.png" alt="" />
        </template>
        <template #right>
          <!-- 点击进入搜索页面，需绑定点击事件 -->
          <van-icon name="search" size="0.48rem" color="white" @click="moreSearchFn"/>
        </template>
      </van-nav-bar>
    </div>
    <!-- v-model关联的激活项的下标（双向绑定） -->
    <!-- 每个van-tab都对应独立的自己的ArticleList -->
    <!-- 细节：
      van-tab循环了很多标签导航，与之一一对应的内容列表不是上来就创建的，默认创建当前激活导航对应列表组件
      第一次切换到对应频道时，才会创建下属的ArticleList组件->created方法
      第二次切换就是显示/隐藏
      -->
    <div class="main">
      <!-- 绑定change事件，监听当前激活的标签改变-->
      <van-tabs v-model="channelId" sticky offset-top="1.226667rem" @change="channelChangeFn">
        <!--在标签指定 name 属性的情况下，v-model:active 的值为当前标签的 name -->
        <van-tab
          v-for="obj in userChannelsList"
          :key="obj.id"
          :name="obj.id"
          :title="obj.name"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="plusClickFn"
      />
    </div>
    <!-- +号弹出层 -->
    <van-popup class="channelPopup" v-model="show" get-container="body">
      <ChannelEdit
      @addChannelEV="addChannelFn"
      @removeChannelEV="removeChannelFn"
      @closeEV="closeFn"
      :userList="userChannelsList"
      :uncheckList="uncheckChannelList"
      ref="editRef"
      v-model="channelId"
      ></ChannelEdit>
      <!-- 父组件使用子组件时，使用v-model指令，在子组件中使用value获取props的值 -->
      </van-popup>
  </div>
</template>

<script>
// import { ref } from 'vue'
import {
  getUserChannelsAPI,
  getAllChannelsAPI,
  updateChannelsAPI,
  deleteChannelsAPI
} from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
// import Notify from 'vant'
// 目标1：获取不同的文章列表，需要传递不同的频道ID
// 想法：让van-tabs的v-model关联频道ID
// 目标2：点击tabs标签页@change触发，重新发送请求，拿到新的数据
// 问题：每次切换tab拿到的数据是新的
export default {
  data () {
    return {
      channelId: 0,
      userChannelsList: [],
      // userArtList: [] // 文章列表
      show: false, //
      allChannelsList: [],
      channelScrollTObj: {} // 保存每个频道的滚动位置  {推荐频道ID:滚动距离，html频道ID：自己滚动距离}
      //
    }
  },
  async created () {
    // 频道列表
    const res = await getUserChannelsAPI()
    console.log(res)
    this.userChannelsList = res.data.data.channels

    // this.channelChangeFn()
    const res2 = await getAllChannelsAPI()
    this.allChannelsList = res2.data.data.channels
  },
  methods: {
    // tabs切换事件--->获取文章列表
    channelChangeFn () {
    // 加载页面内文章列表
    // const res2 = await getAllArticlesAPI({
    //   channel_id: this.channelId, // 先请求默认文章列表
    //   timestamp: new Date().getTime()
    // })
    // console.log(res2)
    // this.userArtList = res2.data.data.results

      // tab栏切换后，设置滚动条位置
      // tab切换时，组件内部，会把切走的容器高度设置为0，滚动条就回到了顶部
      // 切回来的一瞬间没有高度，滚动事件从底下上来也被触发了，因此将数据设置为0
      // 解决：延迟执行
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScrollTObj[this.channelId]
        document.body.scrollTop = this.channelScrollTObj[this.channelId]
      })
    },
    // 滚动条滑动的距离
    scrollFn () {
      // 谷歌浏览器内核和安卓手机内置浏览器的内核不是同一个
      // 获取scrollTop方式不同
      // 谷歌浏览器用的html的scrollTop
      // 有的浏览器用的body的scrollTop
      // Notify({
      //   message: document.body.scrollTop
      // })
      this.$route.meta.scrollT = document.documentElement.scrollTop || document.body.scrollTop
      // 保存当前频道内滚动条滚动的距离
      this.channelScrollTObj[this.channelId] = document.documentElement.scrollTop || document.body.scrollTop
    },
    plusClickFn () {
      this.show = true
    },
    // 添加新的频道
    async addChannelFn (channelObj) {
      this.userChannelsList.push(channelObj)
      // 将添加的频道数据传给后台
      const newArr = this.userChannelsList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj }// 浅拷贝
        delete newObj.name
        newObj.seq = index

        return newObj
      })
      const res = await updateChannelsAPI({
        channels: theNewArr
      })
      console.log(res)
    },
    // 删除频道
    async removeChannelFn (channelObj) {
      const index = this.userChannelsList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelsList.splice(index, 1)
      // 调用删除的API接口，从后台删除
      const res = await deleteChannelsAPI({
        channelId: channelObj.index
      })
      console.log(res)
    },
    // 关闭弹出层函数
    closeFn () {
      this.show = false
      // 关闭后让内部状态回归false
      this.$refs.editRef.isEdit = false
    },
    // 点击首页搜索图标，跳转到搜索页面
    moreSearchFn () {
      this.$router.push('/search')
    }
  },
  components: { ArticleList, ChannelEdit },
  // 计算属性
  computed: {
  //   uncheckChannelList () {
  //     const newArr = []
  //     for (let i = 0; i < this.allChannelsList.length; i++) {
  //       if (this.userChannelsList.indexOf(this.allChannelsList[i]) <= -1) {
  //         newArr.push(this.allChannelsList[i])
  //       }
  //     }
  //     return newArr
  //   }
  // }
    uncheckChannelList () {
      // 目标：把所有频道数组挨个对象取出，去用户已选频道数组里查找，如果找不到，则让filter方法收集到新数组中
      const newArr = this.allChannelsList.filter(bigObj => {
        const index = this.userChannelsList.findIndex(smallObj => {
          return smallObj.id === bigObj.id
        })
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  activated () {
    // window和document，监听网页滚动的事件
    // html标签获取scroll和Top，滚动的距离和设置滚动的位置
    window.addEventListener('scroll', this.scrollFn)
    // 设置滚动条的位置
    document.documentElement.scrollTop = this.$route.meta.scrollT
    document.body.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    // 网页失焦后移除事件
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style scoped lang="less">
.van-nav-bar {
  background-color: #07c160;
}
.logo {
  width: 100px;
  height: 60px;
}
.main {
  padding-top: 46px;
  // padding-bottom: 46px;
}
/deep/ .van-tabs__line {
  background-color: #07c160;
}
// 设置tabs容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 60px;
  right: 8px;
  z-index: 999;
}
.channelPopup {
  width: 100%;
  height: 100%;
  // width: 100vw;
  // height: 100vh;
  // vw和vh是css3新增的单位
}
</style>
