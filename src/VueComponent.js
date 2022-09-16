import Vue from 'vue'
import {
  NavBar, Form, Field, CellGroup, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell,
  List, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search, Image as VanImage, Divider,
  ShareSheet, Tag, Dialog, DatetimePicker, Loading, Lazyload
} from 'vant'

Vue.use(Lazyload, {
  preLoad: 0.9, // 屏幕高度的范围百分比，预加载范围
  error: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.yYBFzWZ0R970KK2bJhwO9AHaEi?pid=ImgDet&rs=1'
  // 懒加载图片失败，使用错误提示图片
})
Vue.use(Loading)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(ShareSheet)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(NavBar)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Form)
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
