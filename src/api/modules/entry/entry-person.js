import axios from '@/api/axios'

/** 获取公开人物条目(通过entryId获取的条目)
 * @param {Number}id 条目id
 * @return {Object} 公开条目
 */
export function fetchPersonEntry (id) {
  let method = 'get'
  let path = `/api/public/entry/persons/${id}`
  
  return axios({ method, path })
}