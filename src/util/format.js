import { v4 as uuidv4 } from 'uuid'
import business from '@/store/modules/business'

const defaultValueOfYear = business.state.defaultValueOfYear

// 字符串数组去重
export function uniqueStringArray (arr) {
  return Array.from(new Set(arr))
}

/** 解析数据库存储格式的动画条目数据
 * @param {Object}entryData 数据库数据
 * @return {Object} 可以对应到Vuex的anime中的数据对象
 */
export function parseAnime (entryData) {
  let entry = {}
  // 动画审核ID
  entry.recordId = entryData.recordId
  // 动画条目ID
  entry.entryId = entryData.entryId
  // 中文名、外文(原)名
  entry.chineseName = entryData.chineseName
  entry.foreignName = entryData.foreignName
  // 别名列表
  entry.otherNames = {}
  entryData.otherNames && entryData.otherNames.split('|').forEach(otherName => entry.otherNames[uuidv4()] = otherName)
  // 媒介、来源
  entry.typeMedium = entryData.typeMedium
  entry.typeSource = entryData.typeSource
  // 题材
  entry.typeGenres = []
  entryData.typeGenres && entryData.typeGenres.split('|').forEach(typeGenre => entry.typeGenres.push(Number(typeGenre)))
  // 制片国家/地区
  entry.regions = []
  entryData.regions && entryData.regions.split('|').forEach(region => entry.regions.push(Number(region)))
  // 首播日期
  entry.releaseDates = {}
  entryData.releaseDates && entryData.releaseDates.split('|').forEach(releaseDate => {
    let date = releaseDate.split('-')
    // 编辑条目绑定year数据的element ui的datePicker组件，只接收字符串，因此year不转换成数字
    entry.releaseDates[uuidv4()] = {
      year: date[0],
      month: Number(date[1]),
      day: Number(date[2]),
      region: date[3]
    }
  })
  // 网络播放版权网站格式化
  entry.copyrights = []
  entryData.copyrights && entryData.copyrights.split('|').forEach(copyright => entry.copyrights.push(Number(copyright)))
  // 官网链接
  entry.officialUrl = entryData.officialUrl
  // 剧情简介
  entry.intro = entryData.intro
  // 制作 Staff
  entry.staffs = []
  entryData.staffs && entryData.staffs.split('|').forEach(staff => {
    let s = staff.split(':')
    entry.staffs.push({
      positionName: s[0],
      personId: s[1],
      personName: s[2]
    })
  })
  // 阵容 Cast
  entry.casts = []
  entryData.casts && entryData.casts.split('|').forEach(cast => {
    let c = cast.split(':')
    entry.casts.push({
      characterId: c[0],
      characterName: c[1],
      personId: c[2],
      personName: c[3]
    })
  })
  // 修改条目原因
  entry.submitterMessage = entryData.submitterMessage
  // 封面链接
  entry.coverUrl = entryData.coverUrl
  return entry
}

/** 去除默认首播日期，编辑条目专用
 * @param {Object}vuexEntry 可以对应到Vuex的anime中的数据对象
 * @return {Object} 可以对应到Vuex的anime中的数据对象，不包含默认首播日期
 */
export function filterAnimeByReleaseDates (vuexEntry) {
  // 因为vuexEntry有可能是直接从state中传递过来的对象
  // 因此不能直接操作vuexEntry，需要赋值给新的对象，否则可能会报错
  let entry = Object.assign({}, vuexEntry)
  for (let key in entry.releaseDates) {
    if (Number(entry.releaseDates[key].year) === defaultValueOfYear) {
      entry.releaseDates = {}
      break
    }
  }
  return entry
}

/** 解析数据库存储格式的人物条目数据
 * @param {Object}entryData 数据库数据
 * @return {Object} 可以对应到Vuex的person中的数据对象
 */
export function parsePerson (entryData) {
  let entry = {}
  
  // 人物审核ID
  entry.recordId = entryData.recordId
  // 人物条目ID
  entry.entryId = entryData.entryId
  // 人物条目类型
  entry.typePerson = entryData.typePerson
  // 中文名、外文(原)名
  entry.chineseName = entryData.chineseName
  entry.foreignName = entryData.foreignName
  // 别名列表
  entry.otherNames = {}
  entryData.otherNames && entryData.otherNames.split('|').forEach(otherName => entry.otherNames[uuidv4()] = otherName)
  // 生日、出生地
  entry.birthday = entryData.birthday
  entry.birthplace = entryData.birthplace
  // 简介
  entry.intro = entryData.intro
  // 成员
  entry.members = []
  entryData.members && entryData.members.split('|').forEach(member => {
    let m = member.split(':')
    entry.members.push({
      positionName: m[0],
      personId: m[1],
      personName: m[2]
    })
  })
  // 修改条目原因
  entry.submitterMessage = entryData.submitterMessage
  // 封面链接
  entry.coverUrl = entryData.coverUrl
  return entry
}