import {
  fetchDictionaryPersons,
  addDictionaryPerson,
  updateDictionaryPerson,
  deleteDictionaryPerson
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
    FETCH_DICTIONARY_PERSONS: ({ commit, state }) => {
      return fetchDictionaryPersons(state.searchContent, state.pagination.pageSize, state.pagination.currentPage)
        .then(({ count, rows }) => {
          commit('pagination/SET_TOTAL', { value: count })
          commit('SET_TABLE', { value: rows })
          return Promise.resolve()
        })
    },
    
    SEARCH_DICTIONARY_PERSONS: ({ commit, dispatch, state }, { searchContent }) => {
      commit('SET_SEARCH_CONTENT', { value: searchContent })
      commit('pagination/INIT')
      return dispatch('FETCH_DICTIONARY_PERSONS')
    },
    
    ADD_DICTIONARY_PERSON: ({}, { data }) => {
      return addDictionaryPerson(data)
    },
    
    UPDATE_DICTIONARY_PERSON: ({}, { id, data }) => {
      return updateDictionaryPerson(id, data)
    },
    
    DELETE_DICTIONARY_PERSON: ({}, { id }) => {
      return deleteDictionaryPerson(id)
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