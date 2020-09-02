<template>
  <el-header class="header">
    <el-container class="inner">
      <h1 class="header-logo">Tuile <sup><span class="badge-primary">beta</span></sup></h1>
      <el-menu class="header-menu" mode="horizontal" :default-active="$route.path" :router="true">
        <el-menuItem index="/">首页</el-menuItem>
        <el-menuItem index="/tag" disabled>分类</el-menuItem>
        <el-menuItem index="/chart" disabled>排行榜</el-menuItem>
      </el-menu>
      <!-- <el-input class="header-search" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input> -->
      <el-input class="header-search" placeholder="绝赞开发中" suffix-icon="el-icon-search" disabled></el-input>
      <el-menu class="header-menu header-user-menu" mode="horizontal" :default-active="$route.path" :router="true">
        <el-submenu index="/edit">
          <template slot="title">添加条目</template>
          <el-menuItem index="/edit/animes" @click="edit()">动画</el-menuItem>
          <el-menuItem index="/edit/persons" @click="edit()">人物/团体</el-menuItem>
          <el-menuItem index="/edit/characters" @click="edit()" disabled>角色</el-menuItem>
        </el-submenu>
        <el-submenu v-if="username" index="/user">
          <template slot="title">{{ username }}</template>
          <el-menuItem index="/account">个人中心</el-menuItem>
          <el-menuItem @click="signOut()">退出</el-menuItem>
        </el-submenu>
        <el-menuItem v-else index="/sign">登录/注册</el-menuItem>
      </el-menu>
    </el-container>
  </el-header>
</template>

<script>
  import { Menu, Submenu, MenuItem, Input } from 'element-ui'
  
  export default {
    name: 'Header',
    
    components: {
      'el-menu': Menu,
      'el-submenu': Submenu,
      'el-menuItem': MenuItem,
      'el-input': Input
    },
    
    computed: {
      username () {
        return this.$store.state.user.username
      }
    },
    
    beforeMount () {
      if (!this.username) {
        this.setUserMenu()
      }
    },
    
    methods: {
      setUserMenu () {
        this.$store.dispatch('user/FETCH_INFO').catch(err => err)
      },
      
      signOut () {
        this.$store.dispatch('user/SIGN_OUT')
        if (this.$route.matched.some(record => record.meta.requiresAuth)) this.$router.push('/')
      },
      
      edit () {
        // 跳转前先清空activeEditRecordId
        this.$store.commit('CLEAR_ACTIVE_RECORD_ID_FOR_EDIT')
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  
  .header
    background-color: white
    position: fixed
    z-index: 999
    height: 55px
    top: 0
    left: 0
    right: 0
    box-shadow: 0 1px 2px rgba(0, 0, 0, .1)
    .inner
      box-sizing: border-box
      @include main-content
      .header-logo
        margin: auto 10px auto 20px
        .badge
          display: inline-block
          padding: .25em .4em
          font-size: 70%
          font-weight: 700
          line-height: 1
          text-align: center
          white-space: nowrap
          vertical-align: baseline
          border-radius: .25rem
        .badge-primary
          @extend .badge
          color: #fff
          background-color: #007bff
      .header-menu
        /* 覆盖elementui原本样式 */
        border-bottom: none
      .header-search
        width: 250px
        margin: auto
      .header-user-menu
        margin-left: auto
</style>
