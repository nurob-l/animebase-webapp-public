<template>
  <el-container v-if="isEditor">
    <el-header class="account-header">
      <span>{{ type | entryLabel }}条目</span>
    </el-header>
    <el-main class="account-main">
      <el-table :data="table">
        <el-table-column prop="recordId" label="审核id" align="center" sortable></el-table-column>
        <el-table-column label="条目id" align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.entryId" :href="`/entry/${type}/${scope.row.entryId}`" target="_blank" rel="noopener norefferrer">
              {{ scope.row.entryId }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="chineseName" label="中文名" min-width="200" align="center" sortable :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="foreignName" label="外文名" min-width="200" align="center" sortable :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="submitterMessage" label="提交说明" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" align="center" sortable></el-table-column>
        <el-table-column label="状态" align="center" sortable :filters="recordStatus" :filter-method="filterRecordStatus" filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | recordStatusTagType" disable-transitions>{{ scope.row.status | recordStatusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="auditorMessage" label="备注" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="90" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === draft || scope.row.status === fail"
              @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button v-if="scope.row.status === success"
              @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
            <el-button v-else
              @click="handlePreview(scope.row)" type="text" size="small">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountEditor"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Tag, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountEditor from '@/store/modules/account/accountEditor'
  import { setPreview } from '@/util/preview'
  
  export default {
    name: 'AccountEditor',
    
    metaInfo: {
      title: '条目编辑'
    },
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'el-tag': Tag,
      Pagination
    },
    
    props: {
      type: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'animes',
            'persons',
            'characters'
          ].indexOf(value) !== -1
        }
      }
    },
    
    computed: {
      recordStatus () {
        return this.$store.state.business.recordStatus
      },
      isEditor () {
        return this.$store.getters['user/isEditor']
      },
      draft () {
        return this.$store.getters['business/valueOfRecordStatusDraft']
      },
      success () {
        return this.$store.getters['business/valueOfRecordStatusSuccess']
      },
      fail () {
        return this.$store.getters['business/valueOfRecordStatusFail']
      },
      table () {
        return this.$store.state.accountEditor.table[this.type]
      }
    },
    
    asyncData ({ store, route: { params: { type }}}) {
      if (!store.hasModule('accountEditor')) store.registerModule('accountEditor', moduleAccountEditor)
      return store.dispatch('accountEditor/FETCH_RECORDS', { type }).catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountEditor')) {
        this.$store.registerModule('accountEditor', moduleAccountEditor)
        this.$store.dispatch('accountEditor/FETCH_RECORDS', { type: this.type }).catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountEditor')) this.$store.unregisterModule('accountEditor')
    },
    
    methods: {
      filterRecordStatus (value, row) {
        return row.status === value
      },
      
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountEditor/FETCH_RECORDS', { type: this.type })
        loadingInstance.close()
      },
      
      async handleEdit (row) {
        let loadingInstance = Loading.service({ fullscreen: true })
        this.$store.commit('SET_ACTIVE_RECORD_ID_FOR_EDIT', { id: row.recordId })
        await this.fetchEditEntry(this.type, row.recordId)
        loadingInstance.close()
        this.$router.push(`/edit/${this.type}`)
      },
      
      handleBrowse (row) {
        window.open(`/entry/${this.type}/${row.entryId}`, '_blank')
      },
      
      async handlePreview (row) {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.fetchEditEntry(this.type, row.recordId)
        const entry = this.$store.state.record[this.type][row.recordId]
        setPreview(JSON.stringify(entry))
        window.open(`/preview/${this.type}`, '_blank')
        loadingInstance.close()
      },
      
      async fetchEditEntry (type, id) {
        switch (type) {
          case 'animes':
            await this.$store.dispatch('accountEditor/FETCH_ANIME_RECORD', { id })
            break
          case 'persons':
            await this.$store.dispatch('accountEditor/FETCH_PERSON_RECORD', { id })
            break
        }
      }
    }
  }
</script>

<style>
</style>