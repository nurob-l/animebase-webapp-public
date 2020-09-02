import {
  saveAnimeReview,
  fetchAnimeReview,
  deleteAnimeReview
} from '@/api'

export default {
  namespaced: true,
  
  // state: () => ({
  //   entryId: null,
  //   status: null,
  //   content: '',
  //   scoreStory: null,
  //   scoreCharacter: null,
  //   scoreMake: null,
  //   scoreShow: null,
  //   scoreMusic: null,
  //   scoreAvg: null,
  //   recommend: null,
  //   createdAt: null
  // }),
  
  actions: {
    SAVE_ANIME_REVIEW: ({ dispatch }, { review }) => {
      return dispatch('IS_ANIME_REVIEW_VALID', { review }).then(validReview => saveAnimeReview(validReview))
    },
    
    IS_ANIME_REVIEW_VALID: ({}, { review }) => {
      if (review.entryId === null || review.status === null) Promise.reject('参数不对，请刷新页面再试')
      // 分数和推荐要么全填，要么全不填
      if (review.scoreStory && review.scoreCharacter && review.scoreMake && review.scoreShow && review.scoreMusic && review.recommend) {
        return Promise.resolve(review)
      }
      else if (!review.scoreStory && !review.scoreCharacter && !review.scoreMake && !review.scoreShow && !review.scoreMusic && !review.recommend) {
        return Promise.resolve(review)
      }
      else {
        return Promise.reject('亲，请填完评分哦（包括推荐选项），要么全填或者全不填呢')
      }
    },
    
    FETCH_ANIME_REVIEW: ({ commit }, { entryId }) => {
      return fetchAnimeReview(entryId)
    },
    
    DELETE_ANIME_REVIEW: ({}, { entryId }) => {
      return deleteAnimeReview(entryId)
    }
    
    // SET_SCORE_STORY: ({ commit }, { value }) => {
    //   return commit('SET_SCORE_STORY', { value }).then(() => commit('UPDATE_SCORE_AVG'))
    // },
    // SET_SCORE_CHARACTER: ({ commit }, { value }) => {
    //   return commit('SET_SCORE_CHARACTER', { value }).then(() => commit('UPDATE_SCORE_AVG'))
    // },
    // SET_SCORE_MAKE: ({ commit }, { value }) => {
    //   return commit('SET_SCORE_MAKE', { value }).then(() => commit('UPDATE_SCORE_AVG'))
    // },
    // SET_SCORE_SHOW: ({ commit }, { value }) => {
    //   return commit('SET_SCORE_SHOW', { value }).then(() => commit('UPDATE_SCORE_AVG'))
    // },
    // SET_SCORE_MUSIC: ({ commit }, { value }) => {
    //   return commit('SET_SCORE_MUSIC', { value }).then(() => commit('UPDATE_SCORE_AVG'))
    // }
  },
  
  mutations: {
    // SET_REVIEW: (state, { review }) => {
    //   state = Object.assign(state, review)
    // },
    // SET_ENTRY_ID: (state, { value }) => {
    //   state.entryId = value
    // },
    // SET_STATUS: (state, { value }) => {
    //   state.status = value
    // },
    // SET_SCORE_STORY: (state, { value }) => {
    //   state.scoreStory = value
    // },
    // SET_SCORE_CHARACTER: (state, { value }) => {
    //   state.scoreCharacter = value
    // },
    // SET_SCORE_MAKE: (state, { value }) => {
    //   state.scoreMake = value
    // },
    // SET_SCORE_SHOW: (state, { value }) => {
    //   state.scoreShow = value
    // },
    // SET_SCORE_MUSIC: (state, { value }) => {
    //   state.scoreMusic = value
    // },
    // SET_RECOMMEND: (state, { value }) => {
    //   state.recommend = value
    // },
    // SET_CONTENT: (state, { value }) => {
    //   state.content = value
    // },
    // UPDATE_SCORE_AVG: (state) => {
    //   if ( state.scoreStory
    //     && state.scoreCharacter
    //     && state.scoreMake
    //     && state.scoreShow
    //     && state.scoreMusic ) {
    //     state.scoreAvg =  state.scoreStory     * 0.2
    //                     + state.scoreCharacter * 0.2
    //                     + state.scoreMake      * 0.2
    //                     + state.scoreShow      * 0.2
    //                     + state.scoreMusic     * 0.2
    //   }
    // }
  }
}