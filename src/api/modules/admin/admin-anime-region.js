import axios from '@/api/axios'

/** 管理员获取动画制片地区表
 * @param {Number}pageSize 每页多少个
 * @param {Number}currentPage 第几页
 * @return {Object} count表示能获取的所有记录总数，rows表示获取到的记录列表
 */
export function fetchAnimeRegions (pageSize, currentPage) {
  const method = 'get'
  const path = `/api/admin/anime-regions?pageSize=${pageSize}&currentPage=${currentPage}`
  
  return axios({ method, path }).then(({ count, rows }) => ({ count, rows }))
}