import axios from '@/api/axios'

/** 管理员获取职位词典
 * @param {String}searchContent 搜索内容
 * @param {Number}pageSize 每页多少个
 * @param {Number}currentPage 第几页
 * @return {Object} count表示能获取的所有记录总数，rows表示获取到的记录列表
 */
export function fetchDictionaryPositions (searchContent, pageSize, currentPage) {
  const request = {
    method: 'get',
    path: `/api/admin/dictionary-positions?searchContent=${searchContent}&pageSize=${pageSize}&currentPage=${currentPage}`
  }
  
  return axios(request).then(({ count, rows }) => ({ count, rows }))
}

/** 管理员添加职位词典
 * @param {Object}data 职位数据
 */
export function addDictionaryPosition (data) {
  const request = {
    method: 'post',
    path: '/api/admin/dictionary-positions',
    data
  }
  
  return axios(request)
}

/** 管理员更新职位词典
 * @param {Object}id 职位id
 * @param {Object}data 职位数据
 */
export function updateDictionaryPosition (id, data) {
  const request = {
    method: 'put',
    path: `/api/admin/dictionary-positions/${id}`,
    data
  }
  
  return axios(request)
}

/** 管理员删除职位词典
 * @param {Object}id 职位id
 */
export function deleteDictionaryPosition (id) {
  const request = {
    method: 'delete',
    path: `/api/admin/dictionary-positions/${id}`
  }
  
  return axios(request)
}