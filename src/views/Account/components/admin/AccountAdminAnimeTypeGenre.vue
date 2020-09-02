<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画题材</span>
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
        <el-table-column label="题材" align="center">
          <template slot-scope="scope">{{ scope.row.typeId | genreLabel }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnimeTypeGenre"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeTypeGenre from '@/store/modules/account/admin/accountAdminAnimeTypeGenre'
  
  export default {
    name: 'AccountAdminAnimeTypeGenre',
    
    metaInfo: {
      title: '动画题材'
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
        return this.$store.state.accountAdminAnimeTypeGenre.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeTypeGenre')) store.registerModule('accountAdminAnimeTypeGenre', moduleAccountAdminAnimeTypeGenre)
      return store.dispatch('accountAdminAnimeTypeGenre/FETCH_ANIME_TYPE_GENRES').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeTypeGenre')) {
        this.$store.registerModule('accountAdminAnimeTypeGenre', moduleAccountAdminAnimeTypeGenre)
        this.$store.dispatch('accountAdminAnimeTypeGenre/FETCH_ANIME_TYPE_GENRES').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeTypeGenre')) this.$store.unregisterModule('accountAdminAnimeTypeGenre')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeTypeGenre/FETCH_ANIME_TYPE_GENRES')
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