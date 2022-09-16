<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 //profileObj.photo-->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="$store.state.userPhoto"
            @click="imageClickFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="$store.state.userName"
        @click="nameClickFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="profileObj.birthday"
        @click="birthdayClickFn"
      />
    </van-cell-group>
    <!-- 修改名字的弹窗 -->
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :before-close="beforeCloseFn"
    >
      <input type="text" v-fofo v-model="inputUserName" />
    </van-dialog>

   <van-popup round v-model="dateTimePickerShow" position="bottom" :style="{ height: '50%' }" >
      <!-- 选择年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateCancelFn"
        @confirm="dateConfirmFn"
      />
   </van-popup>

  </div>
</template>

<script>
import {
  editUserInfoAPI,
  userEditPhotoAPI,
  updateUserProfileAPI
} from '@/api/index.js'
import { Notify } from 'vant'
import { formatTime } from '@/utils/date.js'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  data () {
    return {
      profileObj: {}, // 用户资料对象
      show: false, // 名字编辑的弹窗显示/隐藏
      inputUserName: '', // 修改的用户名
      minDate: new Date(1920, 0, 1), // 最早的出生时间
      maxDate: new Date(), // 最晚的出生时间
      currentDate: new Date(), // 默认显示的时间
      dateTimePickerShow: false //
    }
  },
  async created () {
    const res = await editUserInfoAPI()
    this.profileObj = res.data.data
  },
  methods: {
    // 利用vuex实现数据共享
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),

    // 图片---点击事件
    imageClickFn () {
      this.$refs.iptFile.click()
    },
    // 文件选择改变---事件
    async onFileChange (e) {
      if (e.target.files.length === 0) return // 用户可能没选择图片文件，组织代码往下运行
      console.log(e.target.files[0]) // 用户选中的文件对象，数组其实是一个特殊的对象
      //  创建FormData对象
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0]) // 请求体里加入一对参数名和值
      const res = await userEditPhotoAPI(theFd)
      this.profileObj.photo = res.data.data.photo // 将图片更新到页面
      // console.log(res)
      this.SET_USERPHOTO(res.data.data.photo) // 更新成功后，同步到vuex中
    },
    // 名字修改
    nameClickFn () {
      // 显示弹出框
      this.show = true
      this.inputUserName = this.profileObj.name // 将用户名回显在弹出框中
    },
    // 名字修改--确认框--关闭前的回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        // 此时点击的是确认按钮
        // 用正则表达式判断用户输入的用户名是否合法
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 通过了校验
          await updateUserProfileAPI({
            name: this.inputUserName
          })
          this.profileObj.name = this.inputUserName // 更新成功--回显到页面上
          this.SET_USERNAME(this.inputUserName)

          done()
        } else {
          Notify({
            type: 'warning',
            message: '用户名只能是1-7位中英文字符和数字的组合'
          })
          done(false)
        }
      } else {
        // 此时点击的是取消按钮，直接关闭
        done() // 弹窗关闭
      }
    },
    // 生日--点击日期事件
    birthdayClickFn () {
      this.dateTimePickerShow = true
      // 数据和页面显示 -> 年-月-日 格式的字符串
      // datetimePicker组件 ->日期对象(利用new date())
      this.currentDate = new Date(this.profileObj.birthday)
    },
    // 时间--取消修改
    dateCancelFn () {
      this.dateTimePickerShow = false
    },
    // 时间--确认修改
    async dateConfirmFn () {
      // 日期选择器组件里currentDate是日期对象，而后端要的是年-月-日字符串，因此需要转换
      await updateUserProfileAPI({
        birthday: formatTime(this.currentDate)
      })
      this.profileObj.birthday = formatTime(this.currentDate)
      this.dateTimePickerShow = false
    }
  }
}
</script>
<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/.van-nav-bar .van-icon {
  color: #07c160;

}
// .van-nav-icon {
//   background-color: #07c160;
// }

.van-icon {
  color: #fff;
}
/deep/.van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
