import {
  fetchRecordsForEditor,
  fetchAnimeRecordForEditor,
  fetchPersonRecordForEditor
} from '@/api'
import { parseAnime, parsePerson } from '@/util/format'
import modulePagination from '@/store/modules/public/pagination'

export default {
  namespaced: true,
  
  modules: {
    pagination: modulePagination
  },
  
  state: () => ({
    table: {
      animes: [],
      persons: []
    }
  }),
  
  actions: {
    FETCH_RECORDS: ({ commit, state }, { type }) => {
      return fetchRecordsForEditor(type, state.pagination.pageSize, state.pagination.currentPage)
        .then(({ count, rows }) => {
          commit('pagination/SET_TOTAL', { value: count })
          commit('SET_TABLE', { type, value: rows })
          return Promise.resolve()
        })
    },
    
    FETCH_ANIME_RECORD: ({ commit, rootState }, { id }) => {
      return rootState.record.animes[id]
        ? Promise.resolve()
        : fetchAnimeRecordForEditor(id).then(entryData => commit('SET_ANIME_RECORD', { entry: parseAnime(entryData) }, { root: true }))
    },
    
    FETCH_PERSON_RECORD: ({ commit, rootState }, { id }) => {
      return rootState.record.persons[id]
        ? Promise.resolve()
        : fetchPersonRecordForEditor(id).then(entryData => commit('SET_PERSON_RECORD', { entry: parsePerson(entryData) }, { root: true }))
    }
  },
  
  mutations: {
    SET_TABLE: (state, { type, value }) => {
      state.table[type] = value
    }
  }
}