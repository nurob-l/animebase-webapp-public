<template>
  <!-- 底部菜单栏，手机端专用 -->
  <v-bottom-navigation
    v-if="$vuetify.breakpoint.xsOnly"
    app
    v-model="bottomNav"
    :input-value="$vuetify.breakpoint.xsOnly"
    grow
  >
    <v-btn value="home">
      <span>首页</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn value="tag">
      <span>分类</span>
      <v-icon>mdi-shape</v-icon>
    </v-btn>

    <v-btn value="chart">
      <span>排行榜</span>
      <v-icon>mdi-align-vertical-bottom</v-icon>
    </v-btn>
    
    <v-btn value="account" @click.stop="showNavigationDrawer = !showNavigationDrawer">
      <span>我的</span>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
  export default {
    name: 'BottomNavigation',
    
    data: () => ({
      bottomNav: 'home'
    }),
    
    computed: {
      showNavigationDrawer: {
        get () {
          return this.$store.state.settings.showNavigationDrawer
        },
        set (value) {
          this.$store.commit('SET_SHOW_NAVIGATION_DRAWER', { value })
        }
      }
    }
  }
</script>

<style>
</style>
