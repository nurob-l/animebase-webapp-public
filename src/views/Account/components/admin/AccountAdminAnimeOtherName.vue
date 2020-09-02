<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画别名</span>
    </el-header>
    <el-main class="account-main">
      <el-table :data="table">
        <el-table-column label="条目id" align="center" sortable>
          <template slot-scope="scope">
            <a v-if="scope.row.entryId" :href="`/entry/animes/${scope.row.entryId}`" target="_blank">
              {{ scope.row.entryId }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="otherName" label="别名" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnimeOtherName"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeOtherName from '@/store/modules/account/admin/accountAdminAnimeOtherName'
  
  export default {
    name: 'AccountAdminAnimeOtherName',
    
    metaInfo: {
      title: '动画别名'
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
        return this.$store.state.accountAdminAnimeOtherName.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeOtherName')) store.registerModule('accountAdminAnimeOtherName', moduleAccountAdminAnimeOtherName)
      return store.dispatch('accountAdminAnimeOtherName/FETCH_ANIME_OTHER_NAMES').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeOtherName')) {
        this.$store.registerModule('accountAdminAnimeOtherName', moduleAccountAdminAnimeOtherName)
        this.$store.dispatch('accountAdminAnimeOtherName/FETCH_ANIME_OTHER_NAMES').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeOtherName')) this.$store.unregisterModule('accountAdminAnimeOtherName')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeOtherName/FETCH_ANIME_OTHER_NAMES')
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