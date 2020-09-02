import { v4 as uuidv4 } from 'uuid'
import axios from '@/api/axios'
import createOssClient from '@/api/oss'

/** 上传临时的封面图片
 * @param {Number}id 用户id
 * @param {Object}data 图片的Blob类型数据
 * @return {String} 图片的图床url
 */
// ISSUE: 对用户上传的文件限定图片格式和文件大小
export function uploadCover (id, data) {
  return fetchUploadPolicy()
    .then(policy => {
      let ossClient = createOssClient(policy)
      // 需要上传的文件，支持HTML5 file 和 Blob类型
      return Promise.resolve(ossClient.put(`public/temporary/${id}/cover-${uuidv4()}.webp`, data))
    })
    .then(res => Promise.resolve(res.url))
}

/** 删除已上传临时的封面图片
 * @param {Number}id 用户id
 * @param {String}ossUrl 图片的OSS图床url
 */
export function deleteCover (id, ossUrl) {
  // 获取图片名称，格式：***.webp
  const coverName = ossUrl.split(`/temporary/${id}/`)[1]
  return fetchUploadPolicy()
    .then(policy => {
      let ossClient = createOssClient(policy)
      return Promise.resolve(ossClient.delete(`public/temporary/${id}/${coverName}`))
    })
}

/** 获取上传Poliy
 * @return {Object} 上传Poliy对象数据
 */
function fetchUploadPolicy () {
  const request = {
    method: 'get',
    path: '/api/edit/upload-policy'
  }
  // 先检查本地是否已存储Policy
  const uploadPolicy = JSON.parse(localStorage.getItem('uploadPolicy'))
  const now = new Date().getTime()
  if (uploadPolicy && (new Date(uploadPolicy.Credentials.Expiration).getTime()) > now) {
    return Promise.resolve(uploadPolicy)
  } else {
    return axios(request)
      .then(uploadPolicy => {
        localStorage.setItem('uploadPolicy', JSON.stringify(uploadPolicy))
        return Promise.resolve(uploadPolicy)
      })
  }
}
