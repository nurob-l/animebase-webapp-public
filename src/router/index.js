import Vue from 'vue'
import Router from 'vue-router'
import VueMeta from 'vue-meta'

Vue.use(Router)
// HTML Metadata manager for Vue.js
Vue.use(VueMeta)

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [
      // 首页
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home')
      },
      // // 登录页
      // {
      //   path: '/sign',
      //   name: 'sign',
      //   component: () => import(/* webpackChunkName: "sign" */ '@/views/Sign'),
      //   meta: { requiresNoAuth: true }
      // },
      // 添加条目
      {
        path: '/edit/animes',
        component: () => import(/* webpackChunkName: "edit-anime" */ '@/views/Edit/EditAnime'),
        meta: { requiresAuth: true }
      },
      {
        path: '/edit/persons', // 只有点击"让我来完善信息"才会传递id
        component: () => import(/* webpackChunkName: "edit-person" */ '@/views/Edit/EditPerson'),
        meta: { requiresAuth: true }
      },
      // 预览条目
      {
        path: '/preview/animes',
        component: () => import(/* webpackChunkName: "preview-anime" */ '@/views/Entry/PreviewAnime'),
        meta: { requiresAuth: true }
      },
      {
        path: '/preview/persons',
        component: () => import(/* webpackChunkName: "preview-person" */ '@/views/Entry/PreviewPerson'),
        meta: { requiresAuth: true }
      },
      // 浏览公开条目
      {
        path: '/entry/animes/:id(\\d+)',
        component: () => import(/* webpackChunkName: "entry-anime" */ '@/views/Entry/EntryAnime'),
        props: true
      },
      {
        path: '/entry/persons/:id(\\d+)',
        component: () => import(/* webpackChunkName: "entry-person" */ '@/views/Entry/EntryPerson'),
        props: true
      },
      // 新番动画列表(临时)
      {
        path: '/animes/:type',
        component: () => import(/* webpackChunkName: "anime" */ '@/views/Anime'),
        props: true
      },
      // // 新番动画列表
      // {
      //   path: '/animes/:year/:month(\\d+)?',
      //   component: () => import(/* webpackChunkName: "anime" */ '@/views/Anime'),
      //   props: true
      // },
      // // 动画分类
      // {
      //   path: '/tag'
      // },
      // 审核条目
      {
        path: '/audit/animes/:id(\\d+)(/check)?',
        component: () => import(/* webpackChunkName: "audit-anime" */ '@/views/Audit/AuditAnime'),
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: '/audit/persons/:id(\\d+)(/check)?',
        component: () => import(/* webpackChunkName: "audit-person" */ '@/views/Audit/AuditPerson'),
        props: true,
        meta: { requiresAuth: true }
      },
      // 个人中心
      { path: '/account', redirect: '/account/editor/animes' },
      {
        path: '/account',
        name: 'account',
        component: () => import(/* webpackChunkName: "account" */ '@/views/Account'),
        meta: { requiresAuth: true },
        children: [
          {
            path: 'editor/:type',
            component: () => import(/* webpackChunkName: "editor" */ '@/views/Account/components/editor/AccountEditor'),
            props: true
          },
          {
            path: 'auditor/:type',
            component: () => import(/* webpackChunkName: "auditor" */ '@/views/Account/components/auditor/AccountAuditor'),
            props: true
          },
          {
            path: 'admin/anime-records',
            component: () => import(/* webpackChunkName: "admin-anime-record" */ '@/views/Account/components/admin/AccountAdminAnimeRecord')
          },
          {
            path: 'admin/animes',
            component: () => import(/* webpackChunkName: "admin-anime" */ '@/views/Account/components/admin/AccountAdminAnime')
          },
          {
            path: 'admin/anime-other-names',
            component: () => import(/* webpackChunkName: "admin-anime-other-name" */ '@/views/Account/components/admin/AccountAdminAnimeOtherName')
          },
          {
            path: 'admin/anime-type-genres',
            component: () => import(/* webpackChunkName: "admin-anime-type-genre" */ '@/views/Account/components/admin/AccountAdminAnimeTypeGenre')
          },
          {
            path: 'admin/anime-regions',
            component: () => import(/* webpackChunkName: "admin-anime-region" */ '@/views/Account/components/admin/AccountAdminAnimeRegion')
          },
          {
            path: 'admin/anime-release-dates',
            component: () => import(/* webpackChunkName: "admin-anime-release-date" */ '@/views/Account/components/admin/AccountAdminAnimeReleaseDate')
          },
          {
            path: 'admin/anime-copyrights',
            component: () => import(/* webpackChunkName: "admin-anime-copyright" */ '@/views/Account/components/admin/AccountAdminAnimeCopyright')
          },
          {
            path: 'admin/anime-staffs',
            component: () => import(/* webpackChunkName: "admin-anime-staff" */ '@/views/Account/components/admin/AccountAdminAnimeStaff')
          },
          {
            path: 'admin/anime-casts',
            component: () => import(/* webpackChunkName: "admin-anime-cast" */ '@/views/Account/components/admin/AccountAdminAnimeCast')
          },
          {
            path: 'admin/person-records',
            component: () => import(/* webpackChunkName: "admin-person-record" */ '@/views/Account/components/admin/AccountAdminPersonRecord')
          },
          {
            path: 'admin/dictionary-positions',
            component: () => import(/* webpackChunkName: "admin-dictionary-position" */ '@/views/Account/components/admin/AccountAdminDictionaryPosition')
          },
          {
            path: 'admin/dictionary-persons',
            component: () => import(/* webpackChunkName: "admin-dictionary-person" */ '@/views/Account/components/admin/AccountAdminDictionaryPerson')
          }
        ]
      },
      // 翻译名词转换表
      {
        path: '/dictionary',
        component: () => import(/* webpackChunkName: "dictionary" */ '@/views/Dictionary')
      },
      {
        path: '/page-not-found',
        name: 'notFound',
        component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound'),
        // 会匹配所有路径
        alias: '*'
      }
    ]
  })
}