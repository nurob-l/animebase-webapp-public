import axios from '@/api/axios'
import { isSigned } from '@/util/auth'

/** 保存动画短评
 * @param {Object}review 合法的短评对象
 */
export function saveAnimeReview (review) {
  let method = 'post'
  let path = '/api/review/animes'
  let data = review
  
  return axios({ method, path, data })
}

/** 获取用户自己的动画短评，在动画条目页面下会自动调用
 * @param {Number}entryId 动画条目ID
 */
export function fetchAnimeReview (entryId) {
  let method = 'get'
  let path = `/api/review/animes/${entryId}`
  return isSigned() ? axios({ method, path }) : Promise.reject()
}

/** 删除用户自己的动画短评
 * @param {Number}entryId 动画条目ID
 */
export function deleteAnimeReview (entryId) {
  let method = 'delete'
  let path = `/api/review/animes/${entryId}`
  return axios({ method, path })
}