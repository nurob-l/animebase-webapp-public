import { parseAnime } from '@/util/format'
import {
  fetchAnimeRecordForAuditor,
  approveAnime,
  denyAnime
} from '@/api'

export default {
  namespaced: true,
  
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    entryId: 0, // 条目ID，用来判断是新增条目还是修改条目
    chineseName: '',
    foreignName: '',
    otherNames: {/* [id: String]: [value: String] */},
    typeMedium: null,
    typeSource: null,
    typeGenres: [/* Number */],
    regions: [/* Number */],
    releaseDates: {/* [id: String]: [releaseDate: Object] */},
    copyrights: [/* Number */],
    officialUrl: '',
    intro: '',
    staffs: [/* Object */],
    casts: [/* Object */],
    submitterMessage: '',
    coverUrl: '', // 当前图片链接
    auditorMessage: ''
  }),
  
  actions: {
    // 审核员获取动画条目档案
    FETCH_RECORD: ({ commit, dispatch }, { id }) => {
      return fetchAnimeRecordForAuditor(id)
        .then(entryData => commit('SET_ANIME', { entry: parseAnime(entryData) }))
    },
    
    // 审核通过
    APPROVE: ({}, { id }) => {
      return approveAnime(id)
    },
    
    // 审核不通过
    DENY: ({ state }, { id }) => {
      return denyAnime(id, state.auditorMessage)
    }
  },
  
  mutations: {
    SET_ANIME: (state, { entry }) => {
      state.entryId = entry.entryId || 0
      state.chineseName = entry.chineseName || ''
      state.foreignName = entry.foreignName || ''
      state.otherNames = entry.otherNames || {}
      state.typeMedium = entry.typeMedium || null
      state.typeSource = entry.typeSource || null
      state.typeGenres = entry.typeGenres || []
      state.regions = entry.regions || []
      state.releaseDates = entry.releaseDates || {}
      state.copyrights = entry.copyrights || []
      state.officialUrl = entry.officialUrl || ''
      state.intro = entry.intro || ''
      state.staffs = entry.staffs || []
      state.casts = entry.casts || []
      state.submitterMessage = entry.submitterMessage || ''
      state.coverUrl = entry.coverUrl || ''
    },
    
    SET_AUDITOR_MESSAGE: (state, { value }) => {
      state.auditorMessage = value
    }
  }
}