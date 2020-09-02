export default {
  // 获取动画条目标题
  animeTitle: (state) => (id) => {
    return state.entry.animes[id].chineseName
      ? state.entry.animes[id].chineseName
      : state.entry.animes[id].foreignName
  },
  
  // 翻译职位
  translatePosition: (state) => (raw) => {
    let cooked = (raw || '').trim()
    state.dictionary['positions'].some(position => {
      if(position.jp === cooked) {
        cooked = position.cn
        return true
      } else {
        return false
      }
    })
    return cooked
  },
  
  // 翻译人名
  translatePerson: (state) => (raw) => {
    let cooked = (raw || '').trim()
    state.dictionary['persons'].some(person => {
      if(person.jp === cooked) {
        cooked = person.cn
        return true
      } else {
        return false
      }
    })
    return cooked
  }
}