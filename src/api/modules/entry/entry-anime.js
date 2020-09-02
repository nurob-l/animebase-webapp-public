import axios from '@/api/axios'

/** 获取公开动画条目(通过entryId获取的条目)
 * @param {Number}id 条目id
 * @return {Object} 公开条目
 */
export function fetchAnimeEntry (id) {
  let method = 'get'
  let path = `/api/public/entry/animes/${id}`
  
  return axios({ method, path })
}

/** 获取公开动画评分相关信息
 * @param {Number}id 条目id
 * @return {Object} 评分
 */
export function fetchAnimeScore (id) {
  let method = 'get'
  let path = `/api/public/animes/score/${id}`
  
  return axios({ method, path })
}