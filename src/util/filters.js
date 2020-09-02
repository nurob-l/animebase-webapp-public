import Vuex from 'vuex'
import moduleBusiness from '@/store/modules/business'

const store = new Vuex.Store(moduleBusiness)

const defaultYear = store.state.defaultValueOfYear
const defaultMonth = store.getters.defaultValueOfMonth
const defaultDay = store.getters.defaultValueOfDay
const defaultReleaseRegion = store.state.defaultValueOfReleaseRegion
const spring = store.getters.valueOfMonthSpring
const summer = store.getters.valueOfMonthSummer
const autumn = store.getters.valueOfMonthAutumn
const winter = store.getters.valueOfMonthWinter

/** 将日期从对象格式转换为字符串格式
 * @param {Object}date 需要转换的日期
 * @return {String} 字符串格式的日期
 */
export function dateStirng ({ year = defaultYear, month = defaultMonth, day = defaultDay, region = defaultReleaseRegion }) {
  // 先转换成数字
  if (typeof year === 'string') year = parseInt(year)
  if (typeof month === 'string') month = parseInt(month)
  if (typeof day === 'string') day = parseInt(day)
  
  let dateString = ''
  if (year === defaultYear) return '未知'
  dateString += year
  switch (month) { // 如果月份未知，则日份也是未知
    case defaultMonth:
      break
    case spring: case summer: case autumn: case winter:
      dateString += '-' + store.getters.getLabelByValue('months', month)
      break
    default:
      dateString += '-' + store.getters.getLabelByValue('months', month)
      switch (day) {
        case defaultDay:
          break
        default:
          dateString += '-' + day
          break
      }
      break
  }
  if (region) dateString += '(' + region + ')'
  return dateString
}

export function releaseCall (valueOfMedium) {
  const valueOfMediumMovie = store.getters.getValueByLabel('typeMediums', '电影')
  return (valueOfMedium === valueOfMediumMovie ? '上映' :'首播') + '日期'
}

export function birthdayCall (valueOfPerson) {
  const valueOfPersonHuman = store.getters.getValueByLabel('typePersons', '人物')
  return valueOfPerson === valueOfPersonHuman ? '生日' :'成立日期'
}

export function birthplaceCall (valueOfPerson) {
  const valueOfPersonHuman = store.getters.getValueByLabel('typePersons', '人物')
  return valueOfPerson === valueOfPersonHuman ? '出生地' :'成立地点'
}

export function mediumLabel (value) {
  return store.getters.getLabelByValue('typeMediums', value)
}

export function sourceLabel (value) {
  return store.getters.getLabelByValue('typeSources', value)
}

export function genreLabel (value) {
  return store.getters.getLabelByValue('typeGenres', value)
}

export function regionLabel (value) {
  return store.getters.getLabelByValue('regions', value)
}

export function copyrightLabel (value) {
  return store.getters.getLabelByValue('videoWebsites', value)
}

export function personLabel (value) {
  return store.getters.getLabelByValue('typePersons', value)
}

export function reviewStatusLabel (value) {
  return store.getters.getLabelByValue('reviewStatus', value)
}

export function recommendStatusLabel (value) {
  return value === store.getters.valueOfRecommendYes
    ? '推荐'
    : '不推荐'
}

export function entryLabel (value) {
  return store.getters.getLabelByValue('typeEntry', value)
}

export function recordStatusTagType (value) {
  return store.state.recordStatus.find(item => item.value === value).tagType
}

export function recordStatusText (value) {
  return store.state.recordStatus.find(item => item.value === value).text
}

/** 将从数据库中获取的dateTime数据按格式输出
 * @param {String}dateTime 需要转换的日期
 * @return {String} 格式化的日期
 */
export function dateTimeString (dateTime) {
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}

/** 根据条目id生成动画条目封面图片链接
 * @param {Number}id 条目id
 * @return {String} 图片链接
 */
export function animeCoverUrl (id) {
  return ossCoverUrl('animes', id)
}

/** 根据条目id生成人物条目封面图片链接
 * @param {Number}id 条目id
 * @return {String} 图片链接
 */
export function personCoverUrl (id) {
  return ossCoverUrl('persons', id)
}

/** 根据条目id生成角色条目封面图片链接
 * @param {Number}id 条目id
 * @return {String} 图片链接
 */
export function characterCoverUrl (id) {
  return ossCoverUrl('characters', id)
}

function ossCoverUrl (type, id) {
  return process.env.NODE_ENV === 'production'
    ? `https://tuile-images.oss-cn-beijing.aliyuncs.com/public/cover/${type}/${id}.webp`
    : `https://tuile-images-test.oss-cn-beijing.aliyuncs.com/public/cover/${type}/${id}.webp`
}

/** 将数值转换成百分比
 * @param {Number}number 数值
 * @return {String} 图片链接
 */
export function percent (number) {
  return (number * 100).toFixed(0) + '%'
}