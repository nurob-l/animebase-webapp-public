import Vue from 'vue'
import { parsePerson } from '@/util/format'
import {
  fetchPersonEntry
} from '@/api'

export default {
  namespaced: true,
  
  actions: {
    // 获取公开动画条目
    FETCH_ENTRY: ({ commit, dispatch }, { id }) => {
      return fetchPersonEntry(id)
        .then(entryData => commit('SET_PERSON_ENTRY', { entry: parsePerson(entryData) }, { root: true }))
    }
  }
}