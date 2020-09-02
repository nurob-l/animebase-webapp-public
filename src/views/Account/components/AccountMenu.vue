<template>
  <el-menu
    class="account-menu"
    :default-openeds="['/account/editor', '/account/auditor', '/account/admin']"
    :default-active="this.$route.path"
    :router="true">
    <el-submenu index="/account/editor" v-if="isEditor">
      <template slot="title"><i class="el-icon-document"></i>条目编辑</template>
      <el-menu-item index="/account/editor/animes">动画</el-menu-item>
      <el-menu-item index="/account/editor/persons">人物/团体</el-menu-item>
      <el-menu-item index="/account/editor/characters" disabled>角色</el-menu-item>
    </el-submenu>
    <el-submenu index="/account/auditor" v-if="isAuditor">
      <template slot="title"><i class="el-icon-document-copy"></i>条目审核</template>
      <el-menu-item index="/account/auditor/animes">动画</el-menu-item>
      <el-menu-item index="/account/auditor/persons">人物/团体</el-menu-item>
      <el-menu-item index="/account/auditor/characters" disabled>角色</el-menu-item>
    </el-submenu>
    <el-submenu index="/account/admin" v-if="isAdmin">
      <template slot="title"><i class="el-icon-magic-stick"></i>条目管理</template>
      <el-menu-item index="/account/admin/anime-records">动画档案</el-menu-item>
      <el-menu-item index="/account/admin/animes">动画</el-menu-item>
      <el-menu-item index="/account/admin/anime-other-names">动画别名</el-menu-item>
      <el-menu-item index="/account/admin/anime-type-genres">动画题材</el-menu-item>
      <el-menu-item index="/account/admin/anime-regions">动画制片地区</el-menu-item>
      <el-menu-item index="/account/admin/anime-release-dates">动画放送日期</el-menu-item>
      <el-menu-item index="/account/admin/anime-copyrights">动画网播版权</el-menu-item>
      <el-menu-item index="/account/admin/anime-staffs">动画Staff</el-menu-item>
      <el-menu-item index="/account/admin/anime-casts">动画Cast</el-menu-item>
      <el-menu-item index="/account/admin/person-records">人物档案</el-menu-item>
      <el-menu-item index="/account/admin/dictionary-positions">职位词典</el-menu-item>
      <el-menu-item index="/account/admin/dictionary-persons">人物词典</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  import { Menu, Submenu, MenuItem } from 'element-ui'

  export default {
    name: 'AccountMenu',
    
    components: {
      'el-menu': Menu,
      'el-submenu': Submenu,
      'el-menu-item': MenuItem
    },
    
    computed: {
      isEditor () {
        return this.$store.getters['user/isEditor']
      },
      
      isAuditor () {
        return this.$store.getters['user/isAuditor']
      },
      
      isAdmin () {
        return this.$store.getters['user/isAdmin']
      }
    }
  }
</script>

<style>
</style>