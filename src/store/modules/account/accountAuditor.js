import {
  fetchRecordsForAuditor,
  fetchAnimeRecordForAuditor,
  fetchPersonRecordForAuditor
} from '@/api'
import { parseAnime, parsePerson } from '@/util/format'
import modulePagination from '@/store/modules/public/pagination'

export default {
  namespaced: true,
  
  modules: {
    pagination: modulePagination
  },
  
  state: () => ({
    currentRecordStatus: null,
    table: {
      animes: [],
      persons: []
    }
  }),
  
  actions: {
    FETCH_RECORDS: ({ commit, state, rootGetters }, { type }) => {
      // 初始化currentRecordStatus
      if (!state.currentRecordStatus) commit('SET_CURRENT_RECORD_STATUS', { value: rootGetters['business/valueOfRecordStatusPending'] })
      return fetchRecordsForAuditor(type, state.currentRecordStatus, state.pagination.pageSize, state.pagination.currentPage)
        .then(({ count, rows }) => {
          commit('pagination/SET_TOTAL', { value: count })
          commit('SET_TABLE', { type, value: rows })
          return Promise.resolve()
        })
    },
    
    FETCH_ANIME_RECORD: ({ commit, rootState }, { id }) => {
      return rootState.record.animes[id]
        ? Promise.resolve()
        : fetchAnimeRecordForAuditor(id).then(entryData => commit('SET_ANIME_RECORD', { entry: parseAnime(entryData) }, { root: true }))
    },
    
    FETCH_PERSON_RECORD: ({ commit, rootState }, { id }) => {
      return rootState.record.persons[id]
        ? Promise.resolve()
        : fetchPersonRecordForAuditor(id).then(entryData => commit('SET_PERSON_RECORD', { entry: parsePerson(entryData) }, { root: true }))
    }
  },
  
  mutations: {
    SET_TABLE: (state, { type, value }) => {
      state.table[type] = value
    },
    
    SET_CURRENT_RECORD_STATUS: (state, { value }) => {
      state.currentRecordStatus = value
    }
  }
}