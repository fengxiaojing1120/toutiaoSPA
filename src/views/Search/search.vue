<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <!-- fefe是自定义的实现聚焦功能的插件  input是插件中自带的属性-->
      <van-search
        v-model.trim="kw"
        v-fofo
        placeholder="请输入搜索关键词"
        background="#07c160"
        shape="round"
        @input="inputFn"
        @search="SearchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list"
        v-if="this.kw.length !== 0"
        >
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestClickFn(str)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="deleteFn"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item"
        v-for = "(str, index) in history"
        :key="index"
        @click="historyClickFn(str)"
        >{{str}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestListAPI } from '@/api/index.js'
import { getStorage, setStorage } from '@/utils/storage.js'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null, // 防抖定时器
      suggestList: [], // 搜索建议列表
      history: JSON.parse(getStorage('his')) || [] // 搜索历史
      // history: ['CSS', 'JSON', 'HTML']
    }
  },
  methods: {
    // 输入框---内容实时改变触发事件方法
    inputFn () {
      // 防抖：延时执行逻辑代码，事件再次触发时，清除上一个定时器
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          const res = await suggestListAPI({
            keywords: this.kw
          })
          this.suggestList = res.data.data.options
        }, 300)
      }
    },
    // 处理字符串中的高亮的关键字
    lightFn (originStr, target) {
      // originStr:原来字符串
      // target:关键字
      // 字符串.replace()
      // 字符串.replaceAll() 替换所有的目标字符
      // 返回值：替换后的完整字符串

      // 如果要使用变量，作为正则的匹配条件，不能用语法糖简化写法
      const reg = new RegExp(target, 'ig') // i表示忽略大小写，g表示全局匹配
      return originStr.replace(reg, (match) => {
        // match就是匹配中时，原字符串里的那个字符，因此只用给原来的加个颜色就行
        return `<span style="color:orange">${match}</span>`
      })
    },

    // 路由器跳转在watch之前跳转，因此要让路由跳转，需添加一个定时器包裹，让跳转最后执行
    // 输入之后，按enter搜索
    SearchFn () {
      // 搜索关键字-保存到数组里
      if (this.kw.length > 0) {
        this.history.push(this.kw)
        setTimeout(() => {
          this.$router.push({
            path: `/search_result/${this.kw}`
          })
        }, 0)
      }
    },
    // 点击搜索时的联想事件列表，开始搜索
    suggestClickFn (str) {
      // 搜索关键字-保存到数组里
      if (str.length > 0) {
        this.history.push(str)
        setTimeout(() => {
          this.$router.push({
            path: `/search_result/${str}`
          })
        }, 0)
      }
    },
    // 点击历史列表开始搜索
    historyClickFn (str) {
      if (str.length > 0) {
        setTimeout(() => {
          this.$router.push({
            path: `/search_result/${str}`
          })
        }, 0)
      }
    },
    // 清除历史记录
    deleteFn () {
      this.history = []
    }

  },
  // watch监听器使用
  watch: {
    history: { // 侦听历史数组的改变
      deep: true, // 深度侦听
      handler () {
        // 立刻覆盖式的保存到本地
        // Set：无序不重复的value集合体（无下角标）
        // 传入的数组有重复元素时，清理掉重复元素，返回无重复的set对象
        const theSet = new Set(this.history)
        const arr = Array.from(theSet)
        setStorage('his', JSON.stringify(arr))
      }
    }
  }

}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #07c160;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
//  搜索建议列表样式
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
