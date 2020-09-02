<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画放送日期</span>
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
        <el-table-column label="放送日期" align="center">
          <template slot-scope="scope">
            {{ {
              year: scope.row.year,
              month: scope.row.month,
              day: scope.row.day,
              region: scope.row.region
            } | dateStirng }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnimeReleaseDate"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeReleaseDate from '@/store/modules/account/admin/accountAdminAnimeReleaseDate'
  
  export default {
    name: 'AccountAdminAnimeReleaseDate',
    
    metaInfo: {
      title: '动画放送日期'
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
        return this.$store.state.accountAdminAnimeReleaseDate.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeReleaseDate')) store.registerModule('accountAdminAnimeReleaseDate', moduleAccountAdminAnimeReleaseDate)
      return store.dispatch('accountAdminAnimeReleaseDate/FETCH_ANIME_RELEASE_DATES').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeReleaseDate')) {
        this.$store.registerModule('accountAdminAnimeReleaseDate', moduleAccountAdminAnimeReleaseDate)
        this.$store.dispatch('accountAdminAnimeReleaseDate/FETCH_ANIME_RELEASE_DATES').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeReleaseDate')) this.$store.unregisterModule('accountAdminAnimeReleaseDate')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeReleaseDate/FETCH_ANIME_RELEASE_DATES')
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