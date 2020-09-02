import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import moduleUser from './modules/user'
import moduleBusiness from './modules/business'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    
    modules: {
      user: moduleUser,
      business: moduleBusiness
    },
    
    state: {
      activeRecordIdForEdit: null, // 当前激活的审核id，用于编辑页面，各类型条目共用该变量
      animeList: {
        current: [/* Object */],
        upcoming: [/* Object */],
        all: [/* Object */],
        finished: [/* Object */]
      },
      entry: { // 通过entry_id获取的条目
        animes: {/* [id: number]: AnimeEntry */},
        persons: {/* [id: number]: PersonEntry */}
      },
      score: { // 通过entry_id获取的评分
        animes: {/* [id: number]: AnimeScore */}
      },
      record: { // 通过record_id获取的条目
        animes: {/* [id: number]: AnimeEntry */},
        persons: {/* [id: number]: PersonEntry */}
      },
      dictionary: {}, // 人物/职位名词表
      settings: { // 系统设置
        showNavigationDrawer: false,
        snackbar: {
          show: false,
          color: 'info',
          message: ''
        }
      }
    },
    
    actions,
    
    mutations,
    
    getters
  })
}