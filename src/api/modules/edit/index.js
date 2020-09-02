import axios from '@/api/axios'

/** 编辑员获取自己贡献的条目列表
 * @param {String}type 条目类型(animes, persons, characters...)
 * @param {Number}pageSize 每页多少个
 * @param {Number}currentPage 第几页
 * @return {Object} count表示能获取的所有条目总数，rows表示获取到的条目列表
 */
export function fetchRecordsForEditor (type, pageSize, currentPage) {
  const method = 'get'
  const path = `/api/edit/${type}?pageSize=${pageSize}&currentPage=${currentPage}`
  
  return axios({ method, path }).then(({ count, rows }) => ({ count, rows }))
}

/** 编辑员获取自己贡献的动画条目
 * @param {Number}id 审核id
 * @return {Object} 条目数据
 */
export function fetchAnimeRecordForEditor (id) {
  const method = 'get'
  const path = `/api/edit/animes/${id}`
  
  return axios({ method, path })
}

/** 编辑员获取自己贡献的人物条目
 * @param {Number}id 审核id
 * @return {Object} 条目数据
 */
export function fetchPersonRecordForEditor (id) {
  const method = 'get'
  const path = `/api/edit/persons/${id}`
  
  return axios({ method, path })
}