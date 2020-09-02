<template>
  <el-container id="app" direction="vertical">
    <Header></Header>
    <transition name="fade" mode="out-in">
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view></router-view>
    </transition>
    <Footer></Footer>
  </el-container>
</template>

<script>
  import Header from '@/components/Header'
  import Footer from '@/components/Footer'

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
      Header,
      Footer
    }
  }
</script>

<style lang="sass">
  $body-background-color: #f2f3f5
  
  body
    // font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif
    font-size: 15px
    background-color: $body-background-color
    margin: 0
    padding-top: 60px
    color: #303133
    overflow-y: scroll
    height: 100%
  
  p.thick
    font-weight: bold
  
  a
    text-decoration: none
    color: #606266
  a:hover
    text-decoration: underline
    color: #409eff
  
  .text-muted
    color: #909399
  
  .font-size-body-small
    font-size: 13px
  
  .center
    text-align: center
  
  .fade-enter-active, .fade-leave-active
    transition: all .2s ease
  .fade-enter, .fade-leave-active
    opacity: 0
</style>