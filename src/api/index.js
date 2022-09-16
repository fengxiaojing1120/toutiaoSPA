// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面中导入这个方法就能发请求
// 优点：请求url路径，可以在这里统一管理
import request from '@/utils/request.js'
import { getStorage } from '@/utils/storage.js'
// import type from 'postcss-pxtorem/lib/type'
// 登录--登录接口
// axios内部，会把参数对象转成json字符串格式发送给后台
// axios内部，会自动携带请求参数（header）
export const loginAPI = ({ mobile, code }) =>
  request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })

// 用户-关注接口
export const userFollowedAPI = ({ userId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})
// 用户-取消关注接口
export const userUnFollowedAPI = ({ userId }) => request({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'

})
// 用户--刷新token
export const getNewTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  // 请求拦截器统一携带的是token，而这次请求需要带的是refresh__token
  headers: {
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})
// 用户--获取个人信息
export const userInfoAPI = () => request({
  url: '/v1_0/user'
})
// 用户--个人资料(编辑资料页面显示)
export const editUserInfoAPI = () => request({
  url: '/v1_0/user/profile'
})
// 用户---更改头像
export const userEditPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd // 从外面传进来的new FormData()表单对象

  // 若请求体是FormData表单对象，也不用自己添加Content-Type，axios发现数据的请求体
  // 是表单对象，也不会将其转化为JSON字符串，也不会带Content_type：application/json，而是交给浏览器，
  // 浏览器发现请求体是formData会自己携带Content_type

  // Content_Type:application/json;axios携带的前提：data请求体是对象->json字符串->发给后台
  // Content_Type：multipart/form-data;浏览器携带的，前提：data请求体必须是FormData类型对象

})
// 用户---更新基本资料
export const updateUserProfileAPI = (dataObj) => {
  // 判断：有值才带参数名给后台，无值参数名不携带
  // 写法1：解构赋值，4个判断，往空对象上添加有值的加上去
  // 写法2：外面想传几对key+value，就直接传入后台
  // 写法3：上面写法不够语义化，看不出obj里有什么
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }
  for (const prop in obj) { // 遍历参数对象里的key
    if (dataObj[prop] === undefined) { // 用key去外面传入的参数对象匹配，如果没有找到，值为undefined
      delete obj[prop] // 从obj身上移除这对属性值
    } else {
      obj[prop] = dataObj[prop] // 如果使用了就从外面对象取出对应的key值，保存到obj上
    }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}
// 频道-获取所有频道
export const getAllChannelsAPI = () =>
  request({
    url: '/v1_0/channels',
    method: 'GET'
  })
// 频道-更新用户频道
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels // 用户已选整个频道数组
  }
})
// 频道-删除指定频道
export const deleteChannelsAPI = (channelId) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 频道--获取用户的频道
// 用户没有登录，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () =>
  request({
    url: '/v1_0/user/channels'
  })

// 获取文章列表
export const getAllArticlesAPI = ({ channel_id, timestamp }) =>
  request({
    url: '/v1_0/articles',
    method: 'GET',

    params: {
      channel_id,
      timestamp
    }
  })

// 文章--反馈--不感兴趣的文章

export const dislikeArticleAPI = ({ artId }) =>
  request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: artId
    }
  })

// 文章--反馈--举报垃圾内容
export const reportArticleAPI = ({ artId, type }) =>
  request({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
      target: artId,
      type: type,
      remark:
        '如果想写,可以在逻辑页面判断下。若点击类型是0,再给一个弹出输入框输入其它问题，传参到这里'
    }
  })

// 文章--文章详情
export const detailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`
})

// 文章-对文章点赞
export const likeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})
// 文章--取消对文章点赞
export const unLikeArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 文章-获取-文章评论
export const commentsListAPI = ({ id, offset = null, limit }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: { // axios 只针对params参数，如果发现键值对，值为null，会忽略此参数名和值不携带在?后面
    type: 'a',
    source: id,
    offset,
    limit
  }
})

// 文章-发布评论
export const commentSendAPI = ({ id, content, art_id = null }) => {
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 文章-点赞-取消对文章的点赞
export const unLikeCommentAPI = ({ comId }) => {
  request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}
// 文章-点赞-对文章的点赞
export const likeCommentAPI = ({ comId }) => {
  request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}

// 文章-收藏文章
export const collectionArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/collections',
  method: 'POST',
  data: {
    target: artId
  }
})
// 文章-取消收藏
export const unCollectionArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/collections/${artId}`,
  method: 'DELETE'
})
// 搜索--搜索列表接口
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})
// 搜索-搜索结果
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})
