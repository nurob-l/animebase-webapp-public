import {
  fetchPersonRecords,
  fetchPersonRecord,
  closePersonRecord,
  openPersonRecord,
  rollbackPersonRecord,
  deletePersonRecord
} from '@/api'
import { parsePerson } from '@/util/format'
import modulePagination from '@/store/modules/public/pagination'

export default {
  namespaced: true,
  
  modules: {
    pagination: modulePagination
  },
  
  state: () => ({
    currentRecordStatus: null,
    table: [/* Object */]
  }),
  
  actions: {
    FETCH_PERSON_RECORDS: ({ commit, state }) => {
      // 初始化currentRecordStatus
      if (!state.currentRecordStatus) commit('SET_CURRENT_RECORD_STATUS', { value: 'all' })
      return fetchPersonRecords(state.currentRecordStatus, state.pagination.pageSize, state.pagination.currentPage)
        .then(({ count, rows }) => {
          commit('pagination/SET_TOTAL', { value: count })
          commit('SET_TABLE', { value: rows })
          return Promise.resolve()
        })
    },
    
    FETCH_PERSON_RECORD: ({ commit, rootState }, { id }) => {
      return rootState.record.persons[id]
        ? Promise.resolve()
        : fetchPersonRecord(id).then(entryData => commit('SET_PERSON_RECORD', { entry: parsePerson(entryData) }, { root: true }))
    },
    
    CLOSE: ({}, { id, message }) => {
      return closePersonRecord(id, message)
    },
    
    OPEN: ({}, { id }) => {
      return openPersonRecord(id)
    },
    
    ROLLBACK: ({}, { id, message }) => {
      return rollbackPersonRecord(id, message)
    },
    
    DELETE: ({}, { id }) => {
      return deletePersonRecord(id)
    }
  },
  
  mutations: {
    SET_TABLE: (state, { value }) => {
      state.table = value
    },
    
    SET_CURRENT_RECORD_STATUS: (state, { value }) => {
      state.currentRecordStatus = value
    }
  }
}