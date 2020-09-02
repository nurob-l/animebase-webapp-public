import axios from '@/api/axios'

/** 审核员审核通过人物审核条目
 * @param {Number}id 审核id
 */
export function approvePerson (id) {
  const request = {
    method: 'put',
    path: `/api/audit/persons/${id}/approve`
  }
  return axios(request)
}

/** 审核员审核不通过人物审核条目
 * @param {Number}id 审核id
 * @param {String}auditorMessage 审核不通过的原因
 */
export function denyPerson (id, auditorMessage) {
  const request = {
    method: 'put',
    path: `/api/audit/persons/${id}/deny`,
    data: { auditorMessage }
  }
  return axios(request)
}