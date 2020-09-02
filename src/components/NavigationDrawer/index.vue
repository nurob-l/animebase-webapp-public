<template>
  <v-navigation-drawer
    v-model="showNavigationDrawer"
    app
    right
    temporary
  >
    <template v-slot:prepend>
      <v-list-item
        v-if="!username"
        two-line
        link
        @click="showSign = !showSign"
      >
        <v-list-item-avatar>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>登录/注册</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <v-list-item
        v-else
        two-line
      >
        <v-list-item-avatar>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ username }}</v-list-item-title>
          <v-list-item-subtitle>ID: {{ userId }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    
    <Sign :visible.sync="showSign"></Sign>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item link>
        <v-list-item-action>
          <v-icon>mdi-pencil</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>添加条目</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <v-list-item>
        <v-list-item-action>
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>夜间模式</v-list-item-title>
        </v-list-item-content>
        <v-switch
          v-model="$vuetify.theme.dark"
          primary
        ></v-switch>
      </v-list-item>
    </v-list>
    
    
    <template v-slot:append>
      <v-list
        v-if="username"
        dense
      >
        <v-list-item
          link
          @click="signOut()"
        >
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>退出</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import {
    VList, VListItem, VListItemAvatar, VListItemAction, VListItemContent, VListItemTitle,
    VSwitch
  } from 'vuetify/lib'
  import Sign from '@/components/Sign'

  export default {
    name: 'NavigationDrawer',
    
    components: {
      VList, VListItem, VListItemAvatar, VListItemAction, VListItemContent, VListItemTitle,
      VSwitch,
      Sign
    },
    
    data: () => ({
      showSign: false // 显示登录框
    }),
    
    computed: {
      username () {
        return this.$store.state.user.username
      },
      userId () {
        return this.$store.state.user.userId
      },
      showNavigationDrawer: {
        get () {
          return this.$store.state.settings.showNavigationDrawer
        },
        set (value) {
          this.$store.commit('SET_SHOW_NAVIGATION_DRAWER', { value })
        }
      }
    },
    
    methods: {
      signOut () {
        this.$store.dispatch('user/SIGN_OUT')
        this.$store.commit('SET_SUCCESS_SNACKBAR', '退出成功')
        if (this.$route.matched.some(record => record.meta.requiresAuth)) this.$router.push('/')
      }
    }
  }
</script>

<style>
</style>
