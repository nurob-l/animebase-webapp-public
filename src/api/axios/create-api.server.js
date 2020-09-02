import axios from 'axios'
import LRU from 'lru-cache'
import restApiServer from '@/config/rest-api-server.server'

const isProd = process.env.NODE_ENV === 'production'

// axios 响应拦截器处理响应数据
axios.interceptors.response.use(res => {
  // if(!res.data) console.error('ERROR: no res.data', res)
  // return res.data
  return res.data ? res.data : res
}, err => {
  return Promise.reject(err)
})

export function createAPI() {
  let api = {}
  api.onServer = true
  api.cachedItems = new LRU({
    max: 1000,
    maxAge: isProd
      ? 1000 * 60 * 2 // 2 min cache
      : 1000 // 1 second cache
  })
  
  api.axios = axios
  api.host = restApiServer.host

  return api
}
