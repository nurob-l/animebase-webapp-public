export default {
  namespaced: true,
  
  state: () => ({
    total: 0,
    pageSize: 10,
    currentPage: 1
  }),
  
  mutations: {
    SET_TOTAL: (state, { value }) => {
      state.total = value
    },
    SET_PAGE_SIZE: (state, { value }) => {
      state.pageSize = value
    },
    SET_CURRENT_PAGE: (state, { value }) => {
      state.currentPage = value
    },
    INIT: (state) => {
      state.total = 0
      state.pageSize = 10
      state.currentPage = 1
    }
  }
}