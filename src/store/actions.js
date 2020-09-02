// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
import {
  fetchAnimeList,
  fetchDictionary
} from '@/api'

// `store.dispatch()` 会返回 Promise，
// 以便我们能够知道数据在何时更新
export default {
  FETCH_ANIME_LIST: ({ commit }, { type }) => {
    return fetchAnimeList(type).then(list => commit('SET_ANIME_LIST', { type, list }))
  },
  
  // 获取翻译转换名词表
  FETCH_DICTIONARY: ({ commit, rootState }, { type }) => {
    return rootState.dictionary[type]
      ? Promise.resolve()
      : fetchDictionary(type).then(dictionary => commit('SET_DICTIONARY', { type, dictionary }))
  }
}