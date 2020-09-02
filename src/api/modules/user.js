import axios from '@/api/axios'
import { isSigned } from '@/util/auth'

/** 用户登录认证
 * @param {Object}data 用户的账号密码
 */
export function signIn (data) {
  const request = {
    method: 'post',
    path: '/api/public/signin',
    data
  }
  return axios(request)
    .then(token => {
      // 存储JWT token
      localStorage.setItem('token', token)
      localStorage.setItem('token_exp', new Date().getTime())
    })
}

/** 用户注册认证
 * @param {Object}data 用户的账号密码
 */
export function signUp (data) {
  const request = {
    method: 'post',
    path: '/api/public/signup',
    data
  }
  return axios(request).then(token => {
    // 存储JWT token
    localStorage.setItem('token', token)
    localStorage.setItem('token_exp', new Date().getTime())
  })
}

/** 用户退出登录
 * @param {Object}data 用户的账号密码
 */
export function signOut () {
  localStorage.removeItem('token')
  localStorage.removeItem('token_exp')
  return Promise.resolve()
}

/** 获取用户基本信息
 * @return {Object} 用户基本信息
 */
export function fetchUserInfo () {
  const request = {
    method: 'get',
    path: '/api/user/info'
  }
  return isSigned() ? axios(request) : Promise.reject()
}