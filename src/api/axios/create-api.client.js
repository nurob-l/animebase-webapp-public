import axios from 'axios'
import restApiServer from '@/config/rest-api-server.client'

// axios 请求拦截器处理请求数据
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  config.headers.common['Authorization'] = 'Bearer ' + token
  return config
})

// axios 响应拦截器处理响应数据
axios.interceptors.response.use(res => {
  return res.data
}, err => {
  return Promise.reject(err)
})

export function createAPI () {
  return {
    axios,
    host: restApiServer.host
  }
}