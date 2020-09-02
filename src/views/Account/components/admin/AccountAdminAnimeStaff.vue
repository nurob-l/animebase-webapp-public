<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画Staff</span>
    </el-header>
    <el-main class="account-main">
      <el-table :data="table">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column label="条目id" align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.entryId" :href="`/entry/animes/${scope.row.entryId}`" target="_blank">
              {{ scope.row.entryId }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="positionName" label="职位" align="center"></el-table-column>
        <el-table-column label="人物id" align="center">
          <template slot-scope="scope">
            {{ scope.row.personId ? scope.row.personId : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="personName" label="人物名字" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnimeStaff"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeStaff from '@/store/modules/account/admin/accountAdminAnimeStaff'
  
  export default {
    name: 'AccountAdminAnimeStaff',
    
    metaInfo: {
      title: '动画Staff'
    },
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      Pagination
    },
    
    computed: {
      isAdmin () {
        return this.$store.getters['user/isAdmin']
      },
      table () {
        return this.$store.state.accountAdminAnimeStaff.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeStaff')) store.registerModule('accountAdminAnimeStaff', moduleAccountAdminAnimeStaff)
      return store.dispatch('accountAdminAnimeStaff/FETCH_ANIME_STAFFS').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeStaff')) {
        this.$store.registerModule('accountAdminAnimeStaff', moduleAccountAdminAnimeStaff)
        this.$store.dispatch('accountAdminAnimeStaff/FETCH_ANIME_STAFFS').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeStaff')) this.$store.unregisterModule('accountAdminAnimeStaff')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeStaff/FETCH_ANIME_STAFFS')
        loadingInstance.close()
      },
      
      handleBrowse (row) {
        window.open(`/entry/animes/${row.entryId}`, '_blank')
      }
    }
  }
</script>

<style>
</style>