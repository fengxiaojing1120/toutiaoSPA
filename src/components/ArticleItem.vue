<template>
  <van-cell>
    <template #title>
      <div class="title-box">
        <span>{{ artObj.title }}</span>
        <!-- 单图模式 -->
        <van-image
          class="thumb"
          v-if="artObj.cover.type === 1"
          lazy-load
          :src="artObj.cover.images[0]"
        >
          <template v-slot:error>加载失败</template>
        </van-image>
        <!-- <img
          class="thumb"
          v-if="artObj.cover.type === 1"
          :src="artObj.cover.images[0]"
          alt=""
        /> -->
      </div>
      <div class="thumb-box" v-if="artObj.cover.type > 1">
        <!-- 三图模式-->
        <van-image
          class="thumb"
          v-for="(imgUrl, index) in artObj.cover.images"
          :key="index"
          lazy-load
          :src="imgUrl"
          alt=""
        >
          <template v-slot:error>加载失败</template>
        </van-image>
        <!-- <img
            class="thumb"
            v-for="(imgUrl, index) in artObj.cover.images"
            :key="index"
            :src="imgUrl"
            alt=""
          /> -->
      </div>
    </template>
    <template #label>
      <div class="label-box">
        <div>
          <span>{{ artObj.aut_name }}</span>
          <span> {{ artObj.comm_count }}评论</span>
          <span>{{ formatTime(artObj.pubdate) }}</span>
        </div>
        <!-- "x"按钮 -->
        <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        <van-action-sheet
          v-model="show"
          :cancel-text="cancelName"
          :actions="actions"
          @cancel="cancelFn"
          @select="onSelect"
          get-container="body"
        />
      </div>
    </template>
  </van-cell>
</template>

<script>
// 目标1：点击“反馈内容”数据的切换
// 1.监听点击事件，区分用户点击的是哪一个
// 2.切换actions数组中的数据

// 目标2：二级反馈数据出现，取消按钮的文字换成“返回”
// :cancel-text="cancelName"设置变量，onSelect中，把变量值换成“返回”

// 目标3：点击底部按钮，要区分判断
// 1.标签@cancel取消事件和事件方法
// 2.在里面用cancelName的值，判断用户点击的是否是“返回”
// 把actions数据源换成firstActions
// cancelName文字换成“取消”
// 强制让反馈面板show=true
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report.js'
export default {
  props: {
    artObj: Object, //  自定义属性 文章对象
    isShow: {
      type: Boolean, //
      default: true
    }
  },
  data () {
    return {
      show: false, // 反馈面板显示/隐藏
      actions: firstActions, // 反馈面板选项数组(套对象)
      cancelName: '取消'
    }
  },
  methods: {
    // 因为导入timeAgo是方法，不能直接使用，所以需要重新在methods或者data中定义一个方法
    formatTime: timeAgo, // 函数体是timeAgo
    //  反馈面板-“选项”选择事件
    onSelect (action, item) {
      console.log(action)
      // action中的name  {name:'反馈垃圾内容'}
      // item 索引值
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      if (action.name === '反馈内容') {
        this.actions = secondActions
        this.cancelName = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('dislikeEV', this.artObj.art_id)
        this.show = false
      } else {
        // 二级反馈面板
        this.$emit('reportEV', this.artObj.art_id, action.value)
        this.show = false
      }
    },
    // 反馈面板-底部按钮-点击事件
    cancelFn () {
      if (this.cancelName === '返回') {
        this.show = true
        this.actions = firstActions
        this.cancelName = '取消'
      }
    }
  }
}
</script>

<style scoped lang="less">
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
// 图片的样式
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
