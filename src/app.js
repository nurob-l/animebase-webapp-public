import Vue from 'vue'
import { sync } from 'vuex-router-sync'
// 先引入第三方组件
import { Container, Header, Footer, Main, Row } from 'element-ui'
import vuetify from '@/plugins/vuetify'
// 引入客户端
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import * as filters from './util/filters'

Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Footer.name, Footer)
Vue.component(Main.name, Main)
Vue.component(Row.name, Row)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp (routerMixin) {
  // 创建 router 和 store 实例
  const router = createRouter()
  const store = createStore()
  
  routerMixin && routerMixin(router)

  // 同步路由状态(route state)到 store
  sync(store, router)

  // 创建应用程序实例，将 router 和 store 注入
  const app = new Vue({
    router,
    store,
    vuetify,
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  
  // 暴露 app, router 和 store
  return { app, router, store }
}