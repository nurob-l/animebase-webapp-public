import axios from '@/api/axios'

/** 审核员审核通过动画审核条目
 * @param {Number}id 审核id
 */
export function approveAnime (id) {
  const request = {
    method: 'put',
    path: `/api/audit/animes/${id}/approve`
  }
  return axios(request)
}

/** 审核员审核不通过动画审核条目
 * @param {Number}id 审核id
 * @param {String}auditorMessage 审核不通过的原因
 */
export function denyAnime (id, auditorMessage) {
  const request = {
    method: 'put',
    path: `/api/audit/animes/${id}/deny`,
    data: { auditorMessage }
  }
  return axios(request)
}