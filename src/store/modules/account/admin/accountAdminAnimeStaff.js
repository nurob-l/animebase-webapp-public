import { fetchAnimeStaffs } from '@/api'
import modulePagination from '@/store/modules/public/pagination'

export default {
  namespaced: true,
  
  modules: {
    pagination: modulePagination
  },
  
  state: () => ({
    table: [/* Object */]
  }),
  
  actions: {
    FETCH_ANIME_STAFFS: ({ commit, state }) => {
      return fetchAnimeStaffs(state.pagination.pageSize, state.pagination.currentPage)
        .then(({ count, rows }) => {
          commit('pagination/SET_TOTAL', { value: count })
          commit('SET_TABLE', { value: rows })
          return Promise.resolve()
        })
    }
  },
  
  mutations: {
    SET_TABLE: (state, { value }) => {
      state.table = value
    }
  }
}