// 封装专门处理时间的方法
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'
/**
 * @param {*}
 * @returns 系统时间到之前指定时间的差值
 */
export const timeAgo = (targetTime) => {
  // 格式化时间
  dayjs.extend(relativeTime)
  dayjs.locale('zh')
  const a = dayjs()
  const b = dayjs(targetTime)
  return a.to(b) // 返回多久之前
}
export const formatTime = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD')
}
