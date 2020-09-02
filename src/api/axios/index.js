// this is aliased in webpack config based on server/client build
import { createAPI } from 'create-api'

const logRequests = !!process.env.DEBUG_API || process.env.NODE_ENV !== 'production'
const api = createAPI()

function axios ({ method, path, data = null }) {
  const cache = api.cachedItems
  const url = api.host + path
  const child = url + (data ? JSON.stringify(data) : '')
  logRequests && console.log(`fetching ${child}...`)
  if (cache && cache.has(child)) {
    logRequests && console.log(`cache hit for ${child}.`)
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      api.axios({ method, url, data })
        .then(res => {
          let val = res
          // if (val) val.__lastUpdated = Date.now()
          cache && cache.set(child, val)
          logRequests && console.log(`fetched ${child}.`)
          resolve(val)
        })
        .catch(err => {
          return err.response.data.message
            ? reject(err.response.data) // 业务逻辑方面的错误
            : reject(err) // 请求方面的错误
        })
    })
  }
}

export default axios