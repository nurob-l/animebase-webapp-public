import Vue from 'vue'
import { parseAnime } from '@/util/format'
import {
  fetchAnimeEntry,
  fetchAnimeScore
} from '@/api'

export default {
  namespaced: true,
  
  actions: {
    // 获取公开动画条目
    FETCH_ENTRY: ({ commit, dispatch }, { id }) => {
      return fetchAnimeEntry(id)
        .then(entryData => commit('SET_ANIME_ENTRY', { entry: parseAnime(entryData) }, { root: true }))
    },
    
    // 获取公开动画条目的评分相关数据
    FETCH_SCORE: ({ commit }, { id }) => {
      return fetchAnimeScore(id).then(anime => commit('SET_ANIME_SCORE', { anime }, { root: true }))
    }
  }
}