<template>
  <el-container class="account">
    <el-aside width="200px" class="account-aside">
      <AccountMenu></AccountMenu>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
  import { Aside } from 'element-ui'
  import AccountMenu from './components/AccountMenu'

  export default {
    name: 'Account',
    
    components: {
      'el-aside': Aside,
      AccountMenu
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/account"
</style>