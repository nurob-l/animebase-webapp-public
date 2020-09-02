import axios from '@/api/axios'

/** 获取用户自己的人物条目草稿
 * @param {Object}entryData 条目数据
 */
export function fetchPersonDraft () {
  const request = {
    method: 'get',
    path: '/api/edit/persons/draft'
  }
  return axios(request)
}

/** 保存人物条目草稿
 * @param {Object}entryData 条目数据
 */
export function savePerson (entryData) {
  const request = {
    method: 'post',
    path: '/api/edit/persons/save',
    data: entryData
  }
  return axios(request)
}

/** 提交人物条目
 * @param {Object}entryData 条目数据
 */
export function submitPerson (entryData) {
  const request = {
    method: 'post',
    path: '/api/edit/persons/submit',
    data: entryData
  }
  return axios(request)
}

/** 删除人物草稿
 */
export function deletePerson () {
  const request = {
    method: 'delete',
    path: '/api/edit/persons/draft'
  }
  return axios(request)
}