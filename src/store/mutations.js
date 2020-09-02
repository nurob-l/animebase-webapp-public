import Vue from 'vue'

export default {
  SET_ACTIVE_RECORD_ID_FOR_EDIT: (state, { id }) => {
    state.activeRecordIdForEdit = id
  },
  
  CLEAR_ACTIVE_RECORD_ID_FOR_EDIT: (state) => {
    state.activeRecordIdForEdit = null
  },
  
  SET_ANIME_LIST: (state, { type, list }) => {
    state.animeList[type] = list
  },
  
  // 设置翻译转换名词表
  SET_DICTIONARY: (state, { type, dictionary }) => {
    state.dictionary[type] = dictionary
  },
  
  // 设置公开动画条目
  SET_ANIME_ENTRY: (state, { entry }) => {
    Vue.set(state.entry.animes, entry.entryId, entry || false) /* false means entry not found */
  },
  
  // 设置动画评分数据
  SET_ANIME_SCORE: (state, { anime }) => {
    Vue.set(state.score.animes, anime.entryId, anime || false) /* false means entry not found */
  },
  
  // 设置公开人物条目
  SET_PERSON_ENTRY: (state, { entry }) => {
    Vue.set(state.entry.persons, entry.entryId, entry || false) /* false means entry not found */
  },
  
  // 设置动画条目（通过recordId）
  SET_ANIME_RECORD: (state, { entry }) => {
    Vue.set(state.record.animes, entry.recordId, entry || false) /* false means entry not found */
  },
  
  // 设置人物条目（通过recordId）
  SET_PERSON_RECORD: (state, { entry }) => {
    Vue.set(state.record.persons, entry.recordId, entry || false) /* false means entry not found */
  },
  
  // 设置导航抽屉
  SET_SHOW_NAVIGATION_DRAWER: (state, { value }) => {
    state.settings.showNavigationDrawer = value
  },
  
  // 显示消息条
  SET_SNACKBAR: (state, options) => {
    state.settings.snackbar = Object.assign({
      show: true
    }, options)
  },
  // 显示成功消息条
  SET_SUCCESS_SNACKBAR: (state, message) => {
    state.settings.snackbar = {
      show: true,
      color: 'success',
      message
    }
  },
  // 显示错误消息条
  SET_ERROR_SNACKBAR: (state, message) => {
    state.settings.snackbar = {
      show: true,
      color: 'error',
      message
    }
  }
}