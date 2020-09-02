// 客户端运行过程中需要用到的业务数据
// 各vue组件会用到业务数据
// filter.js会用到业务数据

export default {
  namespaced: true,

  getters: {
    getLabelByValue: (state) => (type, value) => {
      const item = state[type].find(item => item.value === value)
      return item ? item.label : ''
    },
    getValueByLabel: (state) => (type, label) => {
      return state[type].find(item => item.label === label).value
    },
    isMonthDisabled: (state) => (valueOfYear) => {
      return !valueOfYear
    },
    isDayDisabled: (state) => (valueOfMonth) => {
      return !valueOfMonth || valueOfMonth === 99 || valueOfMonth === 3 || valueOfMonth === 7 || valueOfMonth === 11 || valueOfMonth === 15
    },
    isRegionDisabled: (state) => (valueOfYear) => {
      return !valueOfYear
    },
    valueOfMediumMovie: (state, getters) => {
      return getters.getValueByLabel('typeMediums', '电影')
    },
    valueOfMediumOther: (state, getters) => {
      return getters.getValueByLabel('typeMediums', '其他')
    },
    valueOfSourceOther: (state, getters) => {
      return getters.getValueByLabel('typeSources', '其他')
    },
    defaultValueOfMonth: (state, getters) => {
      return getters.getValueByLabel('months', '未知')
    },
    valueOfMonthSpring: (state, getters) => {
      return getters.getValueByLabel('months', '春')
    },
    valueOfMonthSummer: (state, getters) => {
      return getters.getValueByLabel('months', '夏')
    },
    valueOfMonthAutumn: (state, getters) => {
      return getters.getValueByLabel('months', '秋')
    },
    valueOfMonthWinter: (state, getters) => {
      return getters.getValueByLabel('months', '冬')
    },
    defaultValueOfDay: (state, getters) => {
      return getters.getValueByLabel('days', '未知')
    },
    valueOfPersonHuman: (state, getters) => {
      return getters.getValueByLabel('typePersons', '人物')
    },
    valueOfWantToWatch: (state, getters) => {
      return getters.getValueByLabel('reviewStatus', '想看')
    },
    valueOfHaveWatched: (state, getters) => {
      return getters.getValueByLabel('reviewStatus', '看过')
    },
    valueOfRecommendYes: (state, getters) => {
      return getters.getValueByLabel('recommendStatus', '是')
    },
    valueOfRecordStatusDraft: (state, getters) => {
      return getters.getValueByLabel('recordStatus', '草稿')
    },
    valueOfRecordStatusPending: (state, getters) => {
      return getters.getValueByLabel('recordStatus', '待审核')
    },
    valueOfRecordStatusSuccess: (state, getters) => {
      return getters.getValueByLabel('recordStatus', '已通过')
    },
    valueOfRecordStatusFail: (state, getters) => {
      return getters.getValueByLabel('recordStatus', '未通过')
    },
    valueOfRecordStatusClosed: (state, getters) => {
      return getters.getValueByLabel('recordStatus', '已下架')
    },
    roleIdForEditor: (state, getters) => {
      return getters.getValueByLabel('roles', '条目编辑员')
    },
    roleIdForAuditor: (state, getters) => {
      return getters.getValueByLabel('roles', '条目审核员')
    },
    roleIdForAdmin: (state, getters) => {
      return getters.getValueByLabel('roles', '条目管理员')
    }
  },

  state: {
    // 动画媒介
    typeMediums: [{
      value: 2,
      label: 'TV'
    }, {
      value: 3,
      label: 'Web'
    }, {
      value: 4,
      label: '电影'
    }, {
      value: 5,
      label: 'OVA'
    }, {
      value: 6,
      label: 'OAD'
    }, {
      value: 1,
      label: '其他'
    }],
    // 动画改编来源
    typeSources: [{
      value: 2,
      label: '原创作品'
    }, {
      value: 3,
      label: '漫画改编'
    }, {
      value: 4,
      label: '小说改编'
    }, {
      value: 5,
      label: '游戏改编'
    }, {
      value: 1,
      label: '其他'
    }],
    // 动画题材
    typeGenres: [{
      value: 2,
      label: '剧情'
    }, {
      value: 3,
      label: '校园'
    }, {
      value: 4,
      label: '搞笑'
    }, {
      value: 5,
      label: '战斗'
    }, {
      value: 6,
      label: '日常'
    }, {
      value: 7,
      label: '恋爱'
    }, {
      value: 8,
      label: '科幻'
    }, {
      value: 9,
      label: '冒险'
    }, {
      value: 10,
      label: '奇幻'
    }, {
      value: 11,
      label: '运动'
    }, {
      value: 12,
      label: '音乐'
    }, {
      value: 13,
      label: '机甲'
    }, {
      value: 14,
      label: '历史'
    }, {
      value: 15,
      label: '战争'
    }, {
      value: 16,
      label: '悬疑'
    }, {
      value: 17,
      label: '惊悚'
    }, {
      value: 18,
      label: '恐怖'
    }, {
      value: 1,
      label: '其他'
    }],
    // 制片国家/地区
    regions: [{
      value: 2,
      label: '中国'
    }, {
      value: 7,
      label: '日本'
    }, {
      value: 8,
      label: '美国'
    }, {
      value: 1,
      label: '其他'
    }],
    // 月份/季度
    months: [{
      value: 99,
      label: '未知'
    }, {
      value: 1,
      label: '1'
    }, {
      value: 2,
      label: '2'
    }, {
      value: 3,
      label: '冬'
    }, {
      value: 4,
      label: '3'
    }, {
      value: 5,
      label: '4'
    }, {
      value: 6,
      label: '5'
    }, {
      value: 7,
      label: '春'
    }, {
      value: 8,
      label: '6'
    }, {
      value: 9,
      label: '7'
    }, {
      value: 10,
      label: '8'
    }, {
      value: 11,
      label: '夏'
    }, {
      value: 12,
      label: '9'
    }, {
      value: 13,
      label: '10'
    }, {
      value: 14,
      label: '11'
    }, {
      value: 15,
      label: '秋'
    }, {
      value: 16,
      label: '12'
    }],
    // 日份
    days: [{
      value: 99,
      label: '未知'
    }, {
      value: 1,
      label: '1'
    }, {
      value: 2,
      label: '2'
    }, {
      value: 3,
      label: '3'
    }, {
      value: 4,
      label: '4'
    }, {
      value: 5,
      label: '5'
    }, {
      value: 6,
      label: '6'
    }, {
      value: 7,
      label: '7'
    }, {
      value: 8,
      label: '8'
    }, {
      value: 9,
      label: '9'
    }, {
      value: 10,
      label: '10'
    }, {
      value: 11,
      label: '11'
    }, {
      value: 12,
      label: '12'
    }, {
      value: 13,
      label: '13'
    }, {
      value: 14,
      label: '14'
    }, {
      value: 15,
      label: '15'
    }, {
      value: 16,
      label: '16'
    }, {
      value: 17,
      label: '17'
    }, {
      value: 18,
      label: '18'
    }, {
      value: 19,
      label: '19'
    }, {
      value: 20,
      label: '20'
    }, {
      value: 21,
      label: '21'
    }, {
      value: 22,
      label: '22'
    }, {
      value: 23,
      label: '23'
    }, {
      value: 24,
      label: '24'
    }, {
      value: 25,
      label: '25'
    }, {
      value: 26,
      label: '26'
    }, {
      value: 27,
      label: '27'
    }, {
      value: 28,
      label: '28'
    }, {
      value: 29,
      label: '29'
    }, {
      value: 30,
      label: '30'
    }, {
      value: 31,
      label: '31'
    }],
    // 版权网站
    videoWebsites: [{
      value: 2,
      label: '哔哩哔哩'
    }, {
      value: 3,
      label: 'AcFun'
    }, {
      value: 4,
      label: '爱奇异'
    }, {
      value: 5,
      label: '优酷'
    }, {
      value: 6,
      label: '腾讯视频'
    }, {
      value: 7,
      label: '芒果tv'
    }, {
      value: 1,
      label: '其他',
    }],
    // 人物条目类型
    typePersons: [{
      value: 1,
      label: '人物'
    }, {
      value: 2,
      label: '团体'
    }, {
      value: 3,
      label: '公司'
    }],
    // 短评状态
    reviewStatus: [{
      value: 1,
      label: '想看'
    }, {
      value: 2,
      label: '看过'
    }],
    // 作品还未放送/上映时的短评状态
    reviewStatusBeforeRelease: [{
      value: 1,
      label: '想看'
    }],
    // 是否推荐
    recommendStatus: [{
      value: 1,
      label: '是',
      label: '是'
    }, {
      value: 2,
      label: '否'
    }],
    // 条目类型
    typeEntry: [{
      value: 'animes',
      label: '动画'
    }, {
      value: 'persons',
      label: '人物/团体'
    }, {
      value: 'characters',
      label: '角色'
    }],
    // 审核状态
    recordStatus: [{
      value: 1,
      text: '草稿',
      label: '草稿',
      tagType: 'primary'
    }, {
      value: 2,
      text: '待审核',
      label: '待审核',
      tagType: 'info'
    }, {
      value: 3,
      text: '已通过',
      label: '已通过',
      tagType: 'success'
    }, {
      value: 4,
      text: '历史版本',
      label: '历史版本',
      tagType: 'warning'
    }, {
      value: 5,
      text: '未通过',
      label: '未通过',
      tagType: 'danger'
    }, {
      value: 6,
      text: '已下架',
      label: '已下架',
      tagType: 'danger'
    }],
    // 审核状态（审核员用）
    recordStatusForAuditor: [{
      value: 2,
      text: '待审核',
      label: '待审核',
      tagType: 'info'
    }, {
      value: 3,
      text: '已通过',
      label: '已通过',
      tagType: 'success'
    }, {
      value: 4,
      text: '历史版本',
      label: '历史版本',
      tagType: 'warning'
    }, {
      value: 5,
      text: '未通过',
      label: '未通过',
      tagType: 'danger'
    }],
    // 用户角色
    roles: [{
      value: 1,
      label: '普通用户'
    }, {
      value: 2,
      label: '条目编辑员'
    }, {
      value: 3,
      label: '条目审核员'
    }, {
      value: 4,
      label: '条目管理员'
    }],
    // 默认年份
    defaultValueOfYear: 9999,
    // 默认放送/上映地区
    defaultValueOfReleaseRegion: '',
    // 各种表单项最大长度常量
    chineseNameMaxLength: 100,
    foreignNameMaxLength: 100,
    otherNamesMaxLength: 500,
    otherNameMaxLength: 100,
    typeGenresMaxLength: 50,
    regionsMaxLength: 20,
    releaseDatesMaxLength: 100,
    releaseRegionMaxLength: 20,
    copyrightsMaxLength: 20,
    officialUrlMaxLength: 100,
    introMaxLength: 1000,
    staffsMaxLength: 3000,
    staffNameMaxLength: 100,
    castsMaxLength: 3000,
    castNameMaxLength: 100,
    submitterMessageMaxLength: 100,
    auditorMessageMaxLength: 100,
    birthplaceMaxLength: 30,
    membersMaxLength: 3000,
    memberNameMaxLength: 100,
    reviewContentMaxLength: 300
  }
}
