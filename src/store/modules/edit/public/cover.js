import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import {
  uploadCover,
  deleteCover
} from '@/api'

export default {
  namespaced: true,
  
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    coverUrl: '', // 当前图片链接
    localCoverBlobData: null, // 本地待上传的裁剪后的封面图片数据
    ossTemporaryCoverUrl: '', // 已经存储到阿里云OSS上的属于用户自己文件夹的临时图片链接，用于保证数据库与OSS保持一致性
  }),
  
  actions: {
    // 上传本地封面图片数据
    UPLOAD_COVER: ({ state, commit, dispatch, rootState }) => {
      return dispatch('DELETE_OSS_TEMPORARY_COVER') // 先处理ossTemporaryCoverUrl
        .then(() => uploadCover(rootState.user.userId, state.localCoverBlobData)) // 上传封面
        .then(url => { // 处理coverUrl
          const oldUrl = state.coverUrl
          commit('SET_COVER_URL', { value: url })
          commit('SET_OSS_TEMPORARY_COVER_URL', { value: url })
          return Promise.resolve(oldUrl)
        })
        .then(oldUrl => { // 处理localCoverBlobData
          window.URL.revokeObjectURL(oldUrl)
          return commit('CLEAR_LOCAL_COVER_BLOB_DATA')
        })
    },
    
    // 确保当前图片链接与阿里云OSS的一致性
    // 判断当前图片链接是否为已经存储到阿里云OSS上的图片链接
    // 若不是则删除掉OSS上的图片
    ENSURE_COVER_CONSISTENCY: ({ state, commit, dispatch, rootState }) => {
      return state.ossTemporaryCoverUrl !== state.coverUrl
        ? dispatch('DELETE_OSS_TEMPORARY_COVER')
        : Promise.resolve()
    },
    
    // 删除已经存储到阿里云OSS上的属于用户自己文件夹的临时图片
    DELETE_OSS_TEMPORARY_COVER: ({ state, commit, rootState }) => {
      const userId = rootState.user.userId
      const ossUrl = state.ossTemporaryCoverUrl
      return ossUrl
        ? deleteCover(userId, ossUrl).then(() => commit('CLEAR_OSS_TEMPORARY_COVER_URL'))
        : Promise.resolve()
    },
    
    SET_COVER: ({ commit, rootState }, { entry }) => {
      const coverUrl = entry.coverUrl
      if (coverUrl) {
        commit('SET_COVER_URL', { value: coverUrl })
        // 判断是否要设置ossTemporaryCoverUrl
        const userId = rootState.user.userId
        if (coverUrl.indexOf(`/temporary/${userId}/`) !== -1) {
          commit('SET_OSS_TEMPORARY_COVER_URL', { value: coverUrl })
        } else {
          commit('CLEAR_OSS_TEMPORARY_COVER_URL')
        }
      }
      return Promise.resolve()
    }
  },
  
  mutations: {
    SET_COVER_URL: (state, { value }) => {
      state.coverUrl = value
    },
    
    CLEAR_COVER_URL: (state) => {
      state.coverUrl = ''
    },
    
    SET_LOCAL_COVER_BLOB_DATA: (state, { value }) => {
      state.localCoverBlobData = value
    },
    
    CLEAR_LOCAL_COVER_BLOB_DATA: (state) => {
      state.localCoverBlobData = null
    },
    
    SET_OSS_TEMPORARY_COVER_URL: (state, { value }) => {
      state.ossTemporaryCoverUrl = value
    },
    
    CLEAR_OSS_TEMPORARY_COVER_URL: (state) => {
      state.ossTemporaryCoverUrl = ''
    },
    
    CLEAR_COVER: (state) => {
      state.coverUrl = ''
      state.localCoverBlobData = null
      state.ossTemporaryCoverUrl = ''
    }
  }
}