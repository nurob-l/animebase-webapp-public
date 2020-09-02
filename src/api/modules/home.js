import axios from '@/api/axios'

/** 获取首页的动画条目列表
 * @param {String}type 时间段类型
 * @return {Promise} 动画条目列表
 */
export function fetchAnimeList (type) {
  const request = getFetchAnimeListRequest(type)
  return axios(request)
}

/** 获取首页的动画条目列表的请求
 * @param {String}type 时间段类型
 * @return {Object} axios的请求
 */
function getFetchAnimeListRequest (type) {
  let method = 'get'
  let path
  
  switch (type) {
    case 'current':
      path = '/api/public/animes/current'
      break
    case 'upcoming':
      path = '/api/public/animes/upcoming'
      break
    case 'all':
      path = '/api/public/animes/all'
      break
    case 'finished':
      path = '/api/public/animes/finished'
      break
    default:
      throw new Error('参数不合法！')
  }
  
  return { method, path }
}