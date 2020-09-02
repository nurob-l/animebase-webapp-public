import axios from '@/api/axios'

/** 获取翻译转换名词表（词典）
 * @param {String}type 词典类型
 * @return {Promise} 词典
 */
export function fetchDictionary (type) {
  const request = {
    method: 'get',
    path: `/api/public/dictionary/${type}`
  }
  return axios(request)
}