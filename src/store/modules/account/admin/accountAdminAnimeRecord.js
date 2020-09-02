import {
  fetchAnimeRecords,
  fetchAnimeRecord,
  closeAnimeRecord,
  openAnimeRecord,
  rollbackAnimeRecord,
  deleteAnimeRecord
} from '@/api'
import { parseAnime } from '@/util/format'
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
    FETCH_ANIME_RECORDS: ({ commit, state }) => {
      // 初始化currentRecordStatus
      if (!state.currentRecordStatus) commit('SET_CURRENT_RECORD_STATUS', { value: 'all' })
      return fetchAnimeRecords(state.currentRecordStatus, state.pagination.pageSize, state.pagination.currentPage)
        .then(({ count, rows }) => {
          commit('pagination/SET_TOTAL', { value: count })
          commit('SET_TABLE', { value: rows })
          return Promise.resolve()
        })
    },
    
    FETCH_ANIME_RECORD: ({ commit, rootState }, { id }) => {
      return rootState.record.animes[id]
        ? Promise.resolve()
        : fetchAnimeRecord(id).then(entryData => commit('SET_ANIME_RECORD', { entry: parseAnime(entryData) }, { root: true }))
    },
    
    CLOSE: ({}, { id, message }) => {
      return closeAnimeRecord(id, message)
    },
    
    OPEN: ({}, { id }) => {
      return openAnimeRecord(id)
    },
    
    ROLLBACK: ({}, { id, message }) => {
      return rollbackAnimeRecord(id, message)
    },
    
    DELETE: ({}, { id }) => {
      return deleteAnimeRecord(id)
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