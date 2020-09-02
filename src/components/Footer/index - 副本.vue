<template>
  <el-footer class="footer">
    <div class="inner text-muted">
      <p>如有任何意见或建议，请联系至tuile@tuile.top</p>
      <p>QQ交流群：102566225</p>
    </div>
  </el-footer>
</template>

<script>
  export default {
    name: 'Footer'
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  
  .footer
    // padding-top: 3rem
    .inner
      @include main-content
      box-sizing: border-box
      padding: 20px
</style>
