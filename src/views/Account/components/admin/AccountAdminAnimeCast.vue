<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画Cast</span>
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
        <el-table-column label="配音角色id" align="center">
          <template slot-scope="scope">
            {{ scope.row.characterId ? scope.row.characterId : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="characterName" label="角色名字" align="center"></el-table-column>
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
        fatherType="accountAdminAnimeCast"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeCast from '@/store/modules/account/admin/accountAdminAnimeCast'
  
  export default {
    name: 'AccountAdminAnimeCast',
    
    metaInfo: {
      title: '动画Cast'
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
        return this.$store.state.accountAdminAnimeCast.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeCast')) store.registerModule('accountAdminAnimeCast', moduleAccountAdminAnimeCast)
      return store.dispatch('accountAdminAnimeCast/FETCH_ANIME_CASTS').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeCast')) {
        this.$store.registerModule('accountAdminAnimeCast', moduleAccountAdminAnimeCast)
        this.$store.dispatch('accountAdminAnimeCast/FETCH_ANIME_CASTS').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeCast')) this.$store.unregisterModule('accountAdminAnimeCast')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeCast/FETCH_ANIME_CASTS')
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