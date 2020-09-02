import Vue from 'vue'
import { createApp } from './app'
import ProgressBar from './components/ProgressBar'
// import Message from './components/Message'
import { isSigned } from './util/auth'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)
// 全局消息组件
// Vue.prototype.$message = Message

// 客户端特定引导逻辑……
Vue.mixin({
  // 处理路由组件重用
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})
// 需要验证的页面均为CSR，不会经过SSR，因此只需在客户端入口添加检查
function routerMixin (router) {
  // 添加验证, 需要认证的页面在路由之前先检查是否已登录
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isSigned()) {
        next({
          path: '/',
          // query: { redirect: to.fullPath } // 可用于登录后跳转回原来的地方
        })
      } else {
        next()
      }
    } else {
      next() // 确保一定要调用 next()
    }
  })
  
  // 添加验证, 用户已认证情况下跳过这些页面
  // router.beforeEach((to, from, next) => {
  //   if (to.matched.some(record => record.meta.requiresNoAuth)) {
  //     if (isSigned()) {
  //       next({
  //         path: '/'
  //       })
  //     } else {
  //       next()
  //     }
  //   } else {
  //     next() // 确保一定要调用 next()
  //   }
  // })
}

const { app, router, store } = createApp(routerMixin)

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 禁止全局路由错误处理打印
// const originalPush = router.push
// router.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)

router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    // 这里如果有加载指示器 (loading indicator)，就触发
    bar.start()

    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        // 停止加载指示器(loading indicator)
        bar.finish()
        next()
      })
      .catch(next)
  })
  
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount('#app')
})

// service worker
function isLocalhost() {
  return /^http(s)?:\/\/localhost/.test(location.href);
}
if (('https:' === location.protocol || isLocalhost()) && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}