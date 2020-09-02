import {
  fetchDictionaryPositions,
  addDictionaryPosition,
  updateDictionaryPosition,
  deleteDictionaryPosition
} from '@/api'
import modulePagination from '@/store/modules/public/pagination'

export default {
  namespaced: true,
  
  modules: {
    pagination: modulePagination
  },
  
  state: () => ({
    searchContent: '',
    table: [/* Object */]
  }),
  
  actions: {
    FETCH_DICTIONARY_POSITIONS: ({ commit, state }) => {
      return fetchDictionaryPositions(state.searchContent, state.pagination.pageSize, state.pagination.currentPage)
        .then(({ count, rows }) => {
          commit('pagination/SET_TOTAL', { value: count })
          commit('SET_TABLE', { value: rows })
          return Promise.resolve()
        })
    },
    
    SEARCH_DICTIONARY_POSITIONS: ({ commit, dispatch, state }, { searchContent }) => {
      commit('SET_SEARCH_CONTENT', { value: searchContent })
      commit('pagination/INIT')
      return dispatch('FETCH_DICTIONARY_POSITIONS')
    },
    
    ADD_DICTIONARY_POSITION: ({}, { data }) => {
      return addDictionaryPosition(data)
    },
    
    UPDATE_DICTIONARY_POSITION: ({}, { id, data }) => {
      return updateDictionaryPosition(id, data)
    },
    
    DELETE_DICTIONARY_POSITION: ({}, { id }) => {
      return deleteDictionaryPosition(id)
    }
  },
  
  mutations: {
    SET_SEARCH_CONTENT: (state, { value }) => {
      state.searchContent = value
    },
    
    SET_TABLE: (state, { value }) => {
      state.table = value
    }
  }
}