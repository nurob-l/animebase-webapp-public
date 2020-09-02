<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画网播版权</span>
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
        <el-table-column label="视频网站" align="center">
          <template slot-scope="scope">{{ scope.row.websiteId | copyrightLabel }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnimeCopyright"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeCopyright from '@/store/modules/account/admin/accountAdminAnimeCopyright'
  
  export default {
    name: 'AccountAdminAnimeCopyright',
    
    metaInfo: {
      title: '动画网播版权'
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
        return this.$store.state.accountAdminAnimeCopyright.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeCopyright')) store.registerModule('accountAdminAnimeCopyright', moduleAccountAdminAnimeCopyright)
      return store.dispatch('accountAdminAnimeCopyright/FETCH_ANIME_COPYRIGHTS').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeCopyright')) {
        this.$store.registerModule('accountAdminAnimeCopyright', moduleAccountAdminAnimeCopyright)
        this.$store.dispatch('accountAdminAnimeCopyright/FETCH_ANIME_COPYRIGHTS').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeCopyright')) this.$store.unregisterModule('accountAdminAnimeCopyright')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeCopyright/FETCH_ANIME_COPYRIGHTS')
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