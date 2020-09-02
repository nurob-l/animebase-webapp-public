import axios from '@/api/axios'

/** 审核员获取动画条目档案列表
 * @param {String}type 条目类型(animes, persons, characters...)
 * @param {Number}status 条目状态(待审核, 已通过, 未通过...)
 * @param {Number}pageSize 每页多少个
 * @param {Number}currentPage 第几页
 * @return {Object} count表示能获取的所有条目总数，rows表示获取到的条目列表
 */
export function fetchRecordsForAuditor (type, status, pageSize, currentPage) {
  const method = 'get'
  const path = `/api/audit/${type}?status=${status}&pageSize=${pageSize}&currentPage=${currentPage}`
  
  return axios({ method, path }).then(({ count, rows }) => ({ count, rows }))
}

/** 审核员获取动画条目档案
 * @param {Number}id 审核id
 * @return {Object} 条目数据
 */
export function fetchAnimeRecordForAuditor (id) {
  const method = 'get'
  const path = `/api/audit/animes/${id}`
  
  return axios({ method, path })
}

/** 审核员获取人物条目档案
 * @param {Number}id 审核id
 * @return {Object} 条目数据
 */
export function fetchPersonRecordForAuditor (id) {
  const method = 'get'
  const path = `/api/audit/persons/${id}`
  
  return axios({ method, path })
}