import {
  signIn,
  signUp,
  signOut,
  fetchUserInfo
} from '@/api'

export default {
  namespaced: true,
  
  // 用户信息为公共状态，所有组件共用
  // 因此state不用设置为函数工厂
  state: {
    userId: null,
    username: null,
    roles: [/* Object */]
  },
  
  getters: {
    // 注意！为了获取rootGetters参数，getters和rootState不能省略！
    isEditor (state, getters, rootState, rootGetters) {
      return state.roles.some(role => role.roleId === rootGetters['business/roleIdForEditor'])
    },
    
    isAuditor (state, getters, rootState, rootGetters) {
      return state.roles.some(role => role.roleId === rootGetters['business/roleIdForAuditor'])
    },
    
    isAdmin (state, getters, rootState, rootGetters) {
      return state.roles.some(role => role.roleId === rootGetters['business/roleIdForAdmin'])
    }
  },
  
  actions: {
    SIGN_IN: ({ dispatch }, { data }) => {
      return signIn(data).then(() => dispatch('FETCH_INFO'))
    },
    
    SIGN_UP: ({ dispatch }, { data }) => {
      return signUp(data).then(() => dispatch('FETCH_INFO'))
    },
    
    SIGN_OUT: ({ commit }) => {
      return signOut().then(() => commit('CLEAR_INFO'))
    },
    
    FETCH_INFO: ({ commit }) => {
      return fetchUserInfo().then(user => commit('SET_INFO', { user }))
    }
  },
  
  mutations: {
    SET_INFO: (state, { user }) => {
      state.userId = user.userId
      state.username = user.username
      state.roles = user.roles
    },
    
    CLEAR_INFO: (state) => {
      state.userId = null
      state.username = null
      state.roles = []
    }
  }
}