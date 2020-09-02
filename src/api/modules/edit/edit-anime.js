import axios from '@/api/axios'

/** 获取用户自己的动画条目草稿
 * @return {Object} 条目数据
 */
export function fetchAnimeDraft () {
  const request = {
    method: 'get',
    path: '/api/edit/animes/draft'
  }
  return axios(request)
}

/** 保存动画条目草稿
 * @param {Object}entryData 条目数据
 */
export function saveAnime (entryData) {
  const request = {
    method: 'post',
    path: '/api/edit/animes/save',
    data: entryData
  }
  return axios(request)
}

/** 提交动画条目
 * @param {Object}entryData 条目数据
 */
export function submitAnime (entryData) {
  const request = {
    method: 'post',
    path: '/api/edit/animes/submit',
    data: entryData
  }
  return axios(request)
}

/** 删除动画草稿
 */
export function deleteAnime () {
  const request = {
    method: 'delete',
    path: '/api/edit/animes/draft'
  }
  return axios(request)
}