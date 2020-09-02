<template>
  <v-app-bar
    app
    clipped-right
    :dense="$vuetify.breakpoint.xsOnly"
    :hide-on-scroll="$vuetify.breakpoint.xsOnly"
  >
  <!-- <v-app-bar
    app
    clipped-right
    :dense="$vuetify.breakpoint.xsOnly"
  > -->
    <!-- LOGO标题 -->
    <v-toolbar-title class="pr-10">
      <v-badge inline content="beta">
        <span class="title">Tuile</span>
      </v-badge>
    </v-toolbar-title>
    
    <!-- 菜单栏 -->
    <v-tabs
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <v-tab>
        首页
      </v-tab>
      <v-tab disabled>
        分类
      </v-tab>
      <v-tab disabled>
        排行榜
      </v-tab>
    </v-tabs>
    
    <!-- 搜索框 -->
    <v-text-field
      hide-details
      solo-inverted
      flat
      append-icon="mdi-magnify"
      label="Search"
      disabled
      dense
      @click:append="search()"
    ></v-text-field>
    
    <v-divider
      v-if="$vuetify.breakpoint.smAndUp"
      class="ml-4"
      inset
      vertical
    ></v-divider>
    
    <!-- 用户相关 -->
    <v-btn
      v-if="$vuetify.breakpoint.smAndUp"
      icon
      @click.stop="showNavigationDrawer = !showNavigationDrawer"
      class="mr-8"
    >
      <v-icon v-if="username">mdi-account-circle</v-icon>
      <v-badge
        v-else
        content="未登录"
      >
        <v-icon>mdi-account-circle</v-icon>
      </v-badge>
    </v-btn>
  </v-app-bar>
</template>

<script>
  import {
    VToolbarTitle, VBadge, VTabs, VTab, VTextField, VDivider
  } from 'vuetify/lib'
  
  export default {
    name: 'AppBar',
    
    components: {
      VToolbarTitle, VBadge, VTabs, VTab, VTextField, VDivider
    },
    
    computed: {
      showNavigationDrawer: {
        get () {
          return this.$store.state.settings.showNavigationDrawer
        },
        set (value) {
          this.$store.commit('SET_SHOW_NAVIGATION_DRAWER', { value })
        }
      },
      username () {
        return this.$store.state.user.username
      }
    },
    
    beforeMount () {
      if (!this.username) {
        this.fetchUserInfo()
      }
    },
  
    methods: {
      fetchUserInfo () {
        this.$store.dispatch('user/FETCH_INFO').catch(err => err)
      },
    
      search() {}
    }
  }
</script>

<style>
</style>
