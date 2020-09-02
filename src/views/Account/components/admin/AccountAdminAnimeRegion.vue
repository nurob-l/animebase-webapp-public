<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画制片地区</span>
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
        <el-table-column label="制片国家/地区" align="center">
          <template slot-scope="scope">{{ scope.row.regionId | regionLabel }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnimeRegion"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeRegion from '@/store/modules/account/admin/accountAdminAnimeRegion'
  
  export default {
    name: 'AccountAdminAnimeRegion',
    
    metaInfo: {
      title: '动画制片地区'
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
        return this.$store.state.accountAdminAnimeRegion.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeRegion')) store.registerModule('accountAdminAnimeRegion', moduleAccountAdminAnimeRegion)
      return store.dispatch('accountAdminAnimeRegion/FETCH_ANIME_REGIONS').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeRegion')) {
        this.$store.registerModule('accountAdminAnimeRegion', moduleAccountAdminAnimeRegion)
        this.$store.dispatch('accountAdminAnimeRegion/FETCH_ANIME_REGIONS').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeRegion')) this.$store.unregisterModule('accountAdminAnimeRegion')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeRegion/FETCH_ANIME_REGIONS')
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