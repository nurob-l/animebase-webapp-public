import axios from '@/api/axios'

/** 管理员获取人物档案表
 * @param {Number}status 档案状态(待审核, 已通过, 未通过...)
 * @param {Number}pageSize 每页多少个
 * @param {Number}currentPage 第几页
 * @return {Object} count表示能获取的所有记录总数，rows表示获取到的记录列表
 */
export function fetchPersonRecords (status, pageSize, currentPage) {
  const method = 'get'
  const path = status === 'all'
    ? `/api/admin/person-records?pageSize=${pageSize}&currentPage=${currentPage}`
    : `/api/admin/person-records?status=${status}&pageSize=${pageSize}&currentPage=${currentPage}`
  
  return axios({ method, path }).then(({ count, rows }) => ({ count, rows }))
}

/** 管理员获取人物档案表记录
 * @param {Number}id 档案id
 * @return {Object} 条目数据
 */
export function fetchPersonRecord (id) {
  const method = 'get'
  const path = `/api/admin/person-records/${id}`
  
  return axios({ method, path })
}

/** 管理员下架已公开的人物条目
 * @param {Number}id 档案id
 * @param {String}message 下架原因
 */
export function closePersonRecord (id, message) {
  const request = {
    method: 'put',
    path: `/api/admin/person-records/${id}/close`,
    data: { message }
  }
  
  return axios(request)
}

/** 管理员重新上架已下架的人物条目
 * @param {Number}id 档案id
 */
export function openPersonRecord (id) {
  const request = {
    method: 'put',
    path: `/api/admin/person-records/${id}/open`
  }
  
  return axios(request)
}

/** 管理员回滚已公开的人物条目
 * @param {Number}id 档案id
 * @param {String}message 回滚原因
 */
export function rollbackPersonRecord (id, message) {
  const request = {
    method: 'put',
    path: `/api/admin/person-records/${id}/rollback`,
    data: { message }
  }
  
  return axios(request)
}

/** 管理员删除非公开的人物条目档案
 * @param {Number}id 档案id
 */
export function deletePersonRecord (id) {
  const request = {
    method: 'put',
    path: `/api/admin/person-records/${id}/delete`
  }
  
  return axios(request)
}