import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { uniqueStringArray, parseAnime, filterAnimeByReleaseDates } from '@/util/format'
import {
  fetchAnimeDraft,
  saveAnime,
  submitAnime,
  deleteAnime
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
    chineseName: '',
    foreignName: '',
    otherNames: {/* [id: String]: [value: String] */},
    typeMedium: null,
    typeSource: null,
    typeGenres: [/* Number */],
    regions: [/* Number */],
    releaseDates: {/* [id: String]: [releaseDate: Object] */},
    copyrights: [/* Number */],
    officialUrl: '',
    intro: '',
    staffs: [/* Object */],
    casts: [/* Object */],
    submitterMessage: ''
  }),
  
  actions: {
    SET_RELEASE_DATE: ({ state, commit, rootGetters }, { id, prop, value }) => {
      commit('SET_RELEASE_DATE', { id, prop, value })
      if (rootGetters['business/isMonthDisabled'](state.releaseDates[id].year)) {
        commit('DELETE_RELEASE_DATE_PROP', { id, prop: 'month' })
      }
      if (rootGetters['business/isRegionDisabled'](state.releaseDates[id].year)) {
        commit('DELETE_RELEASE_DATE_PROP', { id, prop: 'region' })
      }
      if (rootGetters['business/isDayDisabled'](state.releaseDates[id].month)) {
        commit('DELETE_RELEASE_DATE_PROP', { id, prop: 'day' })
      }
    },
    
    SUBMIT: ({ commit, dispatch }) => {
      return dispatch('FORMAT', 'submit')
        .then(entryData => submitAnime(entryData))
        .then(() => {
          commit('CLEAR_ANIME')
          commit('cover/CLEAR_COVER')
          return Promise.resolve()
        })
    },
    
    SAVE: ({ dispatch }) => {
      return dispatch('FORMAT').then(entryData => saveAnime(entryData))
    },
    
    DELETE: ({ commit, dispatch }) => {
      return dispatch('cover/DELETE_OSS_TEMPORARY_COVER')
        .then(() => deleteAnime())
        .then(() => {
          commit('CLEAR_ANIME')
          commit('cover/CLEAR_COVER')
          return Promise.resolve()
        })
    },
    
    FETCH_DRAFT: ({ commit, dispatch, rootGetters }) => {
      // 初始化typeMedium和typeSource
      commit('SET_TYPE_MEDIUM', { value: rootGetters['business/valueOfMediumOther'] })
      commit('SET_TYPE_SOURCE', { value: rootGetters['business/valueOfSourceOther'] })
      return fetchAnimeDraft()
        .then(entryData => {
          const entry = filterAnimeByReleaseDates(parseAnime(entryData))
          commit('SET_ANIME', { entry })
          return dispatch('cover/SET_COVER', { entry })
        })
    },
    
    FETCH_LOCAL_RECORD: ({ commit, dispatch, rootState }, { id }) => {
      const entry = filterAnimeByReleaseDates(rootState.record.animes[id])
      commit('SET_ANIME', { entry })
      return dispatch('cover/SET_COVER', { entry })
    },
    
    /** 检测表单合法性并返回格式化后的数据库数据
     * @param {String}action 操作类型，可以用来判断是哪个action调用的本函数
     * @return {Object} 可以存入数据库的数据
     */
    FORMAT: ({ state, dispatch, rootState, rootGetters }, action) => {
      let entryData = {}
      
      // 动画条目ID
      entryData.entryId = state.entryId
      
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
      
      if (!state.typeMedium) throw new Error('亲，请选择"媒介"哦')
      entryData.typeMedium = state.typeMedium
      if (!state.typeSource) throw new Error('亲，请选择"来源"哦')
      entryData.typeSource = state.typeSource
      
      // 题材格式化
      let typeGenresString = state.typeGenres.join('|')
      if (typeGenresString.length > rootState.business.typeGenresMaxLength) throw new Error('"题材"选项过多，请删减部分选项')
      entryData.typeGenres = typeGenresString
      
      // 制片国家/地区格式化，格式示例：'1|6|7'
      let regionsString = state.regions.join('|')
      if (regionsString.length > rootState.business.regionsMaxLength) throw new Error('"制片国家/地区"选项过多，请删减部分选项')
      entryData.regions = regionsString
      
      // 首播日期格式化，示例：'y-m-d-region|y-m-d-region'
      let releaseDates = []
      const releaseCall = state.typeMedium === rootGetters['business/valueOfMediumMovie'] ? '上映' :'首播'
      const defaultYear = rootState.business.defaultValueOfYear
      const defaultMonth = rootGetters['business/defaultValueOfMonth']
      const defaultDay = rootGetters['business/defaultValueOfDay']
      const defaultReleaseRegion = rootState.business.defaultValueOfReleaseRegion
      Object.keys(state.releaseDates).forEach(key => {
        let releaseDate = Object.assign({}, state.releaseDates[key]) // 这里需要深拷贝，否则组件可能会表现异常
        // 检查用户输入
        // 如果年份未填，则相当于什么都没填，跳过
        if (!releaseDate.year) return
        if (!releaseDate.month) releaseDate.month = defaultMonth
        if (!releaseDate.day) releaseDate.day = defaultDay
        if (!releaseDate.region) releaseDate.region = defaultReleaseRegion
        // 判断日期是否重复
        if (releaseDates.some(date => (
          date[0] === releaseDate.year &&
          date[1] === releaseDate.month &&
          date[2] === releaseDate.day
        ))) {
          throw new Error(`亲，"${releaseCall}日期"的日期不能重复哦，请删除重复日期`)
        }
        // 判断地区长度限制
        if (releaseDate.region.length > rootState.business.releaseRegionMaxLength) {
          throw new Error(`亲，"${releaseCall}日期"的地区名字过长，应在${rootState.business.releaseRegionMaxLength}字符以内`)
        }
        releaseDates.push([releaseDate.year, releaseDate.month, releaseDate.day, releaseDate.region])
      })
      // 如果放送日期为空，添加默认未知日期
      if (!releaseDates.length) releaseDates.push([
        defaultYear,
        defaultMonth,
        defaultDay,
        defaultReleaseRegion
      ])
      // 格式化成字符串
      let releaseDatesString = releaseDates.map(releaseDate => releaseDate.join('-')).join('|')
      if (releaseDatesString.length > rootState.business.releaseDatesMaxLength) throw new Error(`"${releaseCall}日期"过多`)
      entryData.releaseDates = releaseDatesString
      
      // 网络播放版权网站格式化
      let copyrightsString = state.copyrights.join('|')
      if (copyrightsString.length > rootState.business.copyrightsMaxLength) throw new Error('"网络播放"选项过多，请删减部分选项')
      entryData.copyrights = copyrightsString
      
      // 官网链接
      let officialUrl = state.officialUrl.trim()
      // 去除http头
      if (officialUrl.startsWith('http://')) officialUrl = officialUrl.substring(7)
      if (officialUrl.startsWith('https://')) officialUrl = officialUrl.substring(8)
      if (officialUrl.length > rootState.business.officialUrlMaxLength) throw new Error(`"官网链接"过长，应在${rootState.business.officialUrlMaxLength}字符以内`)
      entryData.officialUrl = officialUrl
      
      // 剧情简介
      let intro = state.intro
      if (intro.length > rootState.business.introMaxLength) throw new Error(`"剧情简介"过长，应在${rootState.business.introMaxLength}字符以内`)
      entryData.intro = intro
      
      // 制作 Staff
      // 检查单项长度限制
      if (state.staffs.some(staff => {
        const maxLength = rootState.business.staffNameMaxLength
        const positionNameLength = staff.positionName ? staff.positionName.length : 0
        const personNameLength = staff.personName ? staff.personName.length : 0
        return positionNameLength > maxLength || personNameLength > maxLength
      })) {
        throw new Error(`"制作 Staff"中的职位名称或人员名字过长，应在${rootState.business.staffNameMaxLength}字符以内`)
      }
      let staffs = state.staffs
        .filter(staff => (staff.positionName || staff.personId || staff.personName))
        .map(staff => [staff.positionName, staff.personId, staff.personName].join(':'))
        .join('|')
      if (staffs.length > rootState.business.staffsMaxLength) throw new Error(`"制作 Staffs"表过长，应在${rootState.business.staffsMaxLength}字符以内`)
      entryData.staffs = staffs

      // 阵容 Cast
      // 检查单项长度限制
      if (state.casts.some(cast => {
        const maxLength = rootState.business.castNameMaxLength
        const characterNameLength = cast.characterName ? cast.characterName.length : 0
        const personNameLength = cast.personName ? cast.personName.length : 0
        return characterNameLength > maxLength || personNameLength > maxLength
      })) {
        throw new Error(`"阵容 Cast"中的角色名字或配音名字过长，应在${rootState.business.castNameMaxLength}字符以内`)
      }
      let casts = state.casts
        .filter(cast => (cast.characterId || cast.characterName || cast.personId || cast.personName))
        .map(cast => [cast.characterId, cast.characterName, cast.personId, cast.personName].join(':'))
        .join('|')
      if (casts.length > rootState.business.castsMaxLength) throw new Error(`"阵容 Cast"表过长，应在${rootState.business.castsMaxLength}字符以内`)
      entryData.casts = casts
      
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
    SET_ANIME: (state, { entry }) => {
      state.entryId = entry.entryId || 0
      state.chineseName = entry.chineseName || ''
      state.foreignName = entry.foreignName || ''
      state.otherNames = entry.otherNames || {}
      state.typeMedium = entry.typeMedium || null
      state.typeSource = entry.typeSource || null
      state.typeGenres = entry.typeGenres || []
      state.regions = entry.regions || []
      state.releaseDates = entry.releaseDates || {}
      state.copyrights = entry.copyrights || []
      state.officialUrl = entry.officialUrl || ''
      state.intro = entry.intro || ''
      state.staffs = entry.staffs || []
      state.casts = entry.casts || []
      state.submitterMessage = entry.submitterMessage || ''
    },
    
    CLEAR_ANIME: (state) => {
      state.entryId = 0
      state.chineseName = ''
      state.foreignName = ''
      state.otherNames = {}
      state.typeMedium = null
      state.typeSource = null
      state.typeGenres = []
      state.regions = []
      state.releaseDates = {}
      state.copyrights = []
      state.officialUrl = ''
      state.intro = ''
      state.staffs = []
      state.casts = []
      state.submitterMessage = ''
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
    
    SET_TYPE_MEDIUM: (state, { value }) => {
      state.typeMedium = value
    },
    
    SET_TYPE_SOURCE: (state, { value }) => {
      state.typeSource = value
    },
    
    SET_TYPE_GENRES: (state, { value }) => {
      state.typeGenres = value
    },
    
    SET_REGIONS: (state, { value }) => {
      state.regions = value
    },
    
    SET_RELEASE_DATE: (state, { id, prop, value }) => {
      Vue.set(state.releaseDates[id], prop, value)
    },
    
    ADD_RELEASE_DATE: (state) => {
      Vue.set(state.releaseDates, uuidv4(), {})
    },
    
    DELETE_RELEASE_DATE: (state, { id }) => {
      Vue.delete(state.releaseDates, id)
    },
    
    DELETE_RELEASE_DATE_PROP: (state, { id, prop }) => {
      Vue.delete(state.releaseDates[id], prop)
    },
    
    SET_COPYRIGHTS: (state, { value }) => {
      state.copyrights = value
    },
    
    SET_OFFICIAL_URL: (state, { value }) => {
      state.officialUrl = value
    },
    
    SET_INTRO: (state, { value }) => {
      state.intro = value
    },
    
    SET_STAFF: (state, { index, prop, value }) => {
      Vue.set(state.staffs[index], prop, value)
    },
    
    MOVE_UP_STAFF: (state, { index }) => {
      if (index > 0) {
        let upStaff = state.staffs[index - 1]
        Vue.set(state.staffs, index - 1, state.staffs[index])
        Vue.set(state.staffs, index, upStaff)
      }
    },
    
    MOVE_DOWN_STAFF: (state, { index }) => {
      if (index < state.staffs.length - 1) {
        let downStaff = state.staffs[index + 1]
        Vue.set(state.staffs, index + 1, state.staffs[index])
        Vue.set(state.staffs, index, downStaff)
      }
    },
    
    INSERT_STAFF: (state, { index }) => {
      let staffs = state.staffs
      staffs.splice(index, 0, {})
      state.staffs = staffs
    },
    
    DELETE_STAFF: (state, { index }) => {
      Vue.delete(state.staffs, index)
    },
    
    ADD_STAFF: (state) => {
      Vue.set(state.staffs, state.staffs.length, {})
    },
    
    SET_STAFFS: (state, { value }) => {
      state.staffs = value
    },
    
    SET_CAST: (state, { index, prop, value }) => {
      Vue.set(state.casts[index], prop, value)
    },
    
    MOVE_UP_CAST: (state, { index }) => {
      if (index > 0) {
        let upCast = state.casts[index - 1]
        Vue.set(state.casts, index - 1, state.casts[index])
        Vue.set(state.casts, index, upCast)
      }
    },
    
    MOVE_DOWN_CAST: (state, { index }) => {
      if (index < state.casts.length - 1) {
        let downCast = state.casts[index + 1]
        Vue.set(state.casts, index + 1, state.casts[index])
        Vue.set(state.casts, index, downCast)
      }
    },
    
    INSERT_CAST: (state, { index }) => {
      let casts = state.casts
      casts.splice(index, 0, {})
      state.casts = casts
    },
    
    DELETE_CAST: (state, { index }) => {
      Vue.delete(state.casts, index)
    },
    
    ADD_CAST: (state) => {
      Vue.set(state.casts, state.casts.length, {})
    },
    
    SET_CASTS: (state, { value }) => {
      state.casts = value
    },
    
    SET_SUBMITTER_MESSAGE: (state, { value }) => {
      state.submitterMessage = value
    }
  }
}