import axios from '@/api/axios'

/** 管理员获取动画档案表
 * @param {Number}status 档案状态(待审核, 已通过, 未通过...)
 * @param {Number}pageSize 每页多少个
 * @param {Number}currentPage 第几页
 * @return {Object} count表示能获取的所有记录总数，rows表示获取到的记录列表
 */
export function fetchAnimeRecords (status, pageSize, currentPage) {
  const method = 'get'
  const path = status === 'all'
    ? `/api/admin/anime-records?pageSize=${pageSize}&currentPage=${currentPage}`
    : `/api/admin/anime-records?status=${status}&pageSize=${pageSize}&currentPage=${currentPage}`
  
  return axios({ method, path }).then(({ count, rows }) => ({ count, rows }))
}

/** 管理员获取动画档案表记录
 * @param {Number}id 档案id
 * @return {Object} 条目数据
 */
export function fetchAnimeRecord (id) {
  const method = 'get'
  const path = `/api/admin/anime-records/${id}`
  
  return axios({ method, path })
}

/** 管理员下架已公开的动画条目
 * @param {Number}id 档案id
 * @param {String}message 下架原因
 */
export function closeAnimeRecord (id, message) {
  const request = {
    method: 'put',
    path: `/api/admin/anime-records/${id}/close`,
    data: { message }
  }
  
  return axios(request)
}

/** 管理员重新上架已下架的动画条目
 * @param {Number}id 档案id
 */
export function openAnimeRecord (id) {
  const request = {
    method: 'put',
    path: `/api/admin/anime-records/${id}/open`
  }
  
  return axios(request)
}

/** 管理员回滚已公开的动画条目
 * @param {Number}id 档案id
 * @param {String}message 回滚原因
 */
export function rollbackAnimeRecord (id, message) {
  const request = {
    method: 'put',
    path: `/api/admin/anime-records/${id}/rollback`,
    data: { message }
  }
  
  return axios(request)
}

/** 管理员删除非公开的动画条目档案
 * @param {Number}id 档案id
 */
export function deleteAnimeRecord (id) {
  const request = {
    method: 'put',
    path: `/api/admin/anime-records/${id}/delete`
  }
  
  return axios(request)
}