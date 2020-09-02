import { parsePerson } from '@/util/format'
import {
  fetchPersonRecordForAuditor,
  approvePerson,
  denyPerson
} from '@/api'

export default {
  namespaced: true,
  
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    entryId: 0, // 条目ID，用来判断是新增条目还是修改条目
    typePerson: null,
    chineseName: '',
    foreignName: '',
    otherNames: {/* [id: String]: [value: String] */},
    birthday: '',
    birthplace: '',
    intro: '',
    members: [/* Object */],
    submitterMessage: '',
    coverUrl: '', // 当前图片链接
    auditorMessage: ''
  }),
  
  actions: {
    // 审核员获取动画审核条目
    FETCH_RECORD: ({ commit, dispatch }, { id }) => {
      return fetchPersonRecordForAuditor(id)
        .then(entryData => commit('SET_PERSON', { entry: parsePerson(entryData) }))
    },
    
    // 审核通过
    APPROVE: ({}, { id }) => {
      return approvePerson(id)
    },
    
    // 审核不通过
    DENY: ({ state }, { id }) => {
      return denyPerson(id, state.auditorMessage)
    }
  },
  
  mutations: {
    SET_PERSON: (state, { entry }) => {
      state.entryId = entry.entryId || 0
      state.typePerson = entry.typePerson || null
      state.chineseName = entry.chineseName || ''
      state.foreignName = entry.foreignName || ''
      state.otherNames = entry.otherNames || {}
      state.birthday = entry.birthday || ''
      state.birthplace = entry.birthplace || ''
      state.intro = entry.intro || ''
      state.members = entry.members || []
      state.submitterMessage = entry.submitterMessage || ''
      state.coverUrl = entry.coverUrl || ''
    },
    
    SET_AUDITOR_MESSAGE: (state, { value }) => {
      state.auditorMessage = value
    }
  }
}