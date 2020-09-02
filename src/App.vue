<template>
  <v-app>
    <NavigationDrawer></NavigationDrawer>
  
    <AppBar></AppBar>

    <Snackbar></Snackbar>
    
    <!-- Sizes your content based upon application components -->
    <v-main>

        <!-- If using vue-router -->
        <router-view
          :init-cols="cols"
          :init-offset="offset"
        ></router-view>
    </v-main>

    <Footer></Footer>

    <BottomNavigation></BottomNavigation>
  </v-app>
</template>

<script>
  import NavigationDrawer from '@/components/NavigationDrawer'
  import AppBar from '@/components/AppBar'
  import Footer from '@/components/Footer'
  import BottomNavigation from '@/components/BottomNavigation'
  import Snackbar from '@/components/Snackbar'

  export default {
    name: 'App',
    
    metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'Tuile',
      // all titles will be injected into this template
      titleTemplate: '%s | Tuile',
      meta: [{
        vmid: 'description',
        name: 'description',
        content: '一个动画资讯、评分、图一乐的专业社区网站，提供最新的动画介绍及评论。',
      }]
    },
    
    components: {
      NavigationDrawer,
      AppBar,
      Footer,
      BottomNavigation,
      Snackbar
    },
    
    computed: {
      cols () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '12'
          case 'sm': return '12'
          case 'md': return '10'
          case 'lg': return '8'
          case 'xl': return '8'
        }
      },
      
      offset () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '0'
          case 'sm': return '0'
          case 'md': return '1'
          case 'lg': return '2'
          case 'xl': return '2'
        }
      }
    }
  }
</script>

<style>
</style>