import axios from '@/api/axios'

/** 管理员获取人物词典
 * @param {String}searchContent 搜索内容
 * @param {Number}pageSize 每页多少个
 * @param {Number}currentPage 第几页
 * @return {Object} count表示能获取的所有记录总数，rows表示获取到的记录列表
 */
export function fetchDictionaryPersons (searchContent, pageSize, currentPage) {
  const request = {
    method: 'get',
    path: `/api/admin/dictionary-persons?searchContent=${searchContent}&pageSize=${pageSize}&currentPage=${currentPage}`
  }
  
  return axios(request).then(({ count, rows }) => ({ count, rows }))
}

/** 管理员添加人物词典
 * @param {Object}data 人物数据
 */
export function addDictionaryPerson (data) {
  const request = {
    method: 'post',
    path: '/api/admin/dictionary-persons',
    data
  }
  
  return axios(request)
}

/** 管理员更新人物词典
 * @param {Object}id 人物id
 * @param {Object}data 人物数据
 */
export function updateDictionaryPerson (id, data) {
  const request = {
    method: 'put',
    path: `/api/admin/dictionary-persons/${id}`,
    data
  }
  
  return axios(request)
}

/** 管理员删除人物词典
 * @param {Object}id 人物id
 */
export function deleteDictionaryPerson (id) {
  const request = {
    method: 'delete',
    path: `/api/admin/dictionary-persons/${id}`
  }
  
  return axios(request)
}