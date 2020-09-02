import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { uniqueStringArray, parsePerson } from '@/util/format'
import {
  fetchPersonDraft,
  savePerson,
  submitPerson,
  deletePerson
} from '@/api'
import moduleCover from './public/cover'

export default {
  namespaced: true,
  
  modules: {
    cover: moduleCover
  },
  
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    entryId: 0, // 条目ID，用来判断是新增条目还是修改条目
    typePerson: null,
    chineseName: '',
    foreignName: '',
    otherNames: {/* [id: String]: [value: String] */},
    birthday: '',
    birthplace: '',
    intro: '',
    members: [/* Object */],
    submitterMessage: ''
  }),
  
  actions: {
    SUBMIT: ({ commit, dispatch }) => {
      return dispatch('FORMAT', 'submit')
        .then(entryData => submitPerson(entryData))
        .then(() => {
          commit('CLEAR_PERSON')
          commit('cover/CLEAR_COVER')
          return Promise.resolve()
        })
    },
    
    SAVE: ({ dispatch }) => {
      return dispatch('FORMAT').then(entryData => savePerson(entryData))
    },
    
    DELETE: ({ commit, dispatch }) => {
      return dispatch('cover/DELETE_OSS_TEMPORARY_COVER')
        .then(() => deletePerson())
        .then(() => {
          commit('CLEAR_PERSON')
          commit('cover/CLEAR_COVER')
          return Promise.resolve()
        })
    },
    
    FETCH_DRAFT: ({ commit, dispatch, rootGetters }) => {
      // 初始化typePerson
      commit('SET_TYPE_PERSON', { value: rootGetters['business/valueOfPersonHuman'] })
      return fetchPersonDraft()
        .then(entryData => {
          const entry = parsePerson(entryData)
          commit('SET_PERSON', { entry })
          return dispatch('cover/SET_COVER', { entry })
        })
    },
    
    FETCH_LOCAL_RECORD: ({ commit, dispatch, rootState }, { id }) => {
      const entry = rootState.record.persons[id]
      commit('SET_PERSON', { entry })
      return dispatch('cover/SET_COVER', { entry })
    },
    
    /** 检测表单合法性并返回格式化后的数据库数据
     * @param {String}action 操作类型，可以用来判断是哪个action调用的本函数
     * @return {Object} 可以存入数据库的数据
     */
    FORMAT: ({ state, dispatch, rootState, rootGetters }, action) => {
      let entryData = {}
      
      // 人物条目ID
      entryData.entryId = state.entryId
     
      // 人物条目类型
      if (!state.typePerson) throw new Error('亲，请选择"类型"哦')
      entryData.typePerson = state.typePerson
      
      // 中文名、外文(原)名
      let chineseName = state.chineseName.trim()
      let foreignName = state.foreignName.trim()
      if (!chineseName && !foreignName) throw new Error('"中文名"或"外文(原)名"须至少填一项')
      if (chineseName.length > rootState.business.chineseNameMaxLength) throw new Error('"中文名"过长')
      if (foreignName.length > rootState.business.foreignNameMaxLength) throw new Error('"外文(原)名"过长')
      entryData.chineseName = chineseName
      entryData.foreignName = foreignName
      
      // 别名列表格式化，格式示例：'a|b|c'
      let otherNames = []
      Object.keys(state.otherNames).forEach(key => {
        let otherName = state.otherNames[key].trim()
        // 检测用户是否填入内容，没填入则跳过
        if (!otherName) return
        otherNames.push(otherName)
      })
      // 去重并格式化成字符串
      let otherNamesString = uniqueStringArray(otherNames).join('|')
      if (otherNamesString.length > rootState.business.otherNamesMaxLength) throw new Error('"别名"总长度过长，请删减部分别名')
      entryData.otherNames = otherNamesString
      
      // 生日
      entryData.birthday = state.birthday
      
      // 出生地
      let birthplace = state.birthplace
      if (birthplace.length > rootState.business.birthplaceMaxLength) throw new Error(`"简介"过长，应在${rootState.business.birthplaceMaxLength}字符以内`)
      entryData.birthplace = birthplace
      
      // 简介
      let intro = state.intro
      if (intro.length > rootState.business.introMaxLength) throw new Error(`"剧情简介"过长，应在${rootState.business.introMaxLength}字符以内`)
      entryData.intro = intro
      
      // 成员
      // 检查单项长度限制
      if (state.members.some(member => {
        const maxLength = rootState.business.memberNameMaxLength
        const positionNameLength = member.positionName ? member.positionName.length : 0
        const personNameLength = member.personName ? member.personName.length : 0
        return positionNameLength > maxLength || personNameLength > maxLength
      })) {
        throw new Error(`"成员"中的位置/职位或成员名字过长，应在${rootState.business.memberNameMaxLength}字符以内`)
      }
      let members = state.members
        .filter(member => (member.positionName || member.personId || member.personName))
        .map(member => [member.positionName, member.personId, member.personName].join(':'))
        .join('|')
      if (members.length > rootState.business.membersMaxLength) throw new Error(`"成员"表过长，应在${rootState.business.membersMaxLength}字符以内`)
      entryData.members = members

      // 修改条目原因，只有提交条目的时候才需要填，保存草稿则不需要
      let submitterMessage = state.entryId ? state.submitterMessage.trim() : '添加条目'
      if (action === 'submit' && !submitterMessage) throw new Error('请填写"修改原因"')
      if (submitterMessage.length > rootState.business.submitterMessageMaxLength) throw new Error('"修改原因"过长')
      entryData.submitterMessage = submitterMessage
      
      // 封面最后处理，检测本地图片还是图床图片
      if (state.cover.localCoverBlobData) {
        // 上传图片至OSS并获得URL
        return dispatch('cover/UPLOAD_COVER')
          .then(() => {
            entryData.coverUrl = state.cover.coverUrl
            return Promise.resolve(entryData)
          })
      } else {
        return dispatch('cover/ENSURE_COVER_CONSISTENCY')
          .then(() => {
            entryData.coverUrl = state.cover.coverUrl
            return Promise.resolve(entryData)
          })
      }
    }
  },
  
  mutations: {
    SET_PERSON: (state, { entry }) => {
      state.entryId = entry.entryId || 0
      state.typePerson = entry.typePerson || null
      state.chineseName = entry.chineseName || ''
      state.foreignName = entry.foreignName || ''
      state.otherNames = entry.otherNames || {}
      state.birthday = entry.birthday || ''
      state.birthplace = entry.birthplace || ''
      state.intro = entry.intro || ''
      state.members = entry.members || []
      state.submitterMessage = entry.submitterMessage || ''
    },
    
    CLEAR_PERSON: (state) => {
      state.entryId = 0
      state.typePerson = null
      state.chineseName = ''
      state.foreignName = ''
      state.otherNames = {}
      state.birthday = ''
      state.birthplace = ''
      state.intro = ''
      state.members = []
      state.submitterMessage = ''
    },
    
    SET_TYPE_PERSON: (state, { value }) => {
      state.typePerson = value
    },
    
    SET_CHINESE_NAME: (state, { value }) => {
      state.chineseName = value
    },
    
    SET_FOREIGN_NAME: (state, { value }) => {
      state.foreignName = value
    },

    SET_OTHER_NAME: (state, { id, value }) => {
      Vue.set(state.otherNames, id, value)
    },
    
    ADD_OTHER_NAME: (state) => {
      Vue.set(state.otherNames, uuidv4(), '')
    },
    
    DELETE_OTHER_NAME: (state, { id }) => {
      Vue.delete(state.otherNames, id)
    },
    
    SET_BIRTHDAY: (state, { value }) => {
      state.birthday = value
    },
    
    SET_BIRTHPLACE: (state, { value }) => {
      state.birthplace = value
    },
    
    SET_INTRO: (state, { value }) => {
      state.intro = value
    },
    
    SET_MEMBER: (state, { index, prop, value }) => {
      Vue.set(state.members[index], prop, value)
    },
    
    MOVE_UP_MEMBER: (state, { index }) => {
      if (index > 0) {
        let upMember = state.members[index - 1]
        Vue.set(state.members, index - 1, state.members[index])
        Vue.set(state.members, index, upMember)
      }
    },
    
    MOVE_DOWN_MEMBER: (state, { index }) => {
      if (index < state.members.length - 1) {
        let downMember = state.members[index + 1]
        Vue.set(state.members, index + 1, state.members[index])
        Vue.set(state.members, index, downMember)
      }
    },
    
    INSERT_MEMBER: (state, { index }) => {
      let members = state.members
      members.splice(index, 0, {})
      state.members = members
    },
    
    DELETE_MEMBER: (state, { index }) => {
      Vue.delete(state.members, index)
    },
    
    ADD_MEMBER: (state) => {
      Vue.set(state.members, state.members.length, {})
    },
    
    SET_MEMBERS: (state, { value }) => {
      state.members = value
    },
    
    SET_SUBMITTER_COMMENT: (state, { value }) => {
      state.submitterMessage = value
    }
  }
}