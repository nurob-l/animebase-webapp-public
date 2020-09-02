<template>
  <el-container v-if="isAuditor">
    <el-header class="account-header">
      <el-radio-group v-model="currentRecordStatus" @change="changeRecordStatus" class="account-header-item">
        <el-radio v-for="status in recordStatusForAuditor" :key="status.value" :label="status.value">
          {{ status.label }}
        </el-radio>
      </el-radio-group>
      <span>{{ type | entryLabel }}条目</span>
    </el-header>
    <el-main class="account-main">
      <el-table :data="table">
        <el-table-column prop="recordId" label="审核id" align="center" sortable></el-table-column>
        <el-table-column label="条目id" align="center" sortable>
          <template slot-scope="scope">
            <a v-if="scope.row.entryId" :href="`/entry/${type}/${scope.row.entryId}`" target="_blank">
              {{ scope.row.entryId }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.chineseName ? scope.row.chineseName : scope.row.foreignName }}
          </template>
        </el-table-column>
        <el-table-column prop="submitterId" label="编辑员id" align="center" sortable></el-table-column>
        <el-table-column prop="submitterMessage" label="提交说明" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" width="160" align="center" sortable></el-table-column>
        <el-table-column label="状态" align="center" sortable filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | recordStatusTagType" disable-transitions>
              {{ scope.row.status | recordStatusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核员id" align="center">
          <template slot-scope="scope">
            {{ scope.row.auditorId || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="auditedAt" label="审核时间" width="160" align="center" sortable>
          <template slot-scope="scope">
            {{ scope.row.auditorId ? scope.row.auditedAt : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="auditorMessage" label="备注" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="90" align="center">
          <template slot-scope="scope">
            <el-button @click="handleAudit(scope.row)" type="text" size="small" v-if="scope.row.status === pending">审核</el-button>
            <el-button @click="handleCheck(scope.row)" type="text" size="small" v-else>查看</el-button>
            <el-button @click="handleBrowse(scope.row)" type="text" size="small" v-if="scope.row.status === success">浏览</el-button>
            <el-button @click="handlePreview(scope.row)" type="text" size="small" v-else>预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAuditor"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { RadioGroup, Radio, Table, TableColumn, Button, Tag, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAuditor from '@/store/modules/account/accountAuditor'
  import { setPreview } from '@/util/preview'
  
  export default {
    name: 'AccountAuditor',
    
    metaInfo: {
      title: '条目审核'
    },
    
    components: {
      'el-radio-group': RadioGroup,
      'el-radio': Radio,
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
      recordStatusForAuditor () {
        return this.$store.state.business.recordStatusForAuditor
      },
      isAuditor () {
        return this.$store.getters['user/isAuditor']
      },
      pending () {
        return this.$store.getters['business/valueOfRecordStatusPending']
      },
      success () {
        return this.$store.getters['business/valueOfRecordStatusSuccess']
      },
      table () {
        return this.$store.state.accountAuditor.table[this.type]
      },
      currentRecordStatus: {
        get () {
          return this.$store.state.accountAuditor.currentRecordStatus
        },
        set (value) {
          this.$store.commit('accountAuditor/SET_CURRENT_RECORD_STATUS', { value })
        }
      }
    },
    
    asyncData ({ store, route: { params: { type }}}) {
      if (!store.hasModule('accountAuditor')) store.registerModule('accountAuditor', moduleAccountAuditor)
      return store.dispatch('accountAuditor/FETCH_RECORDS', { type }).catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAuditor')) {
        this.$store.registerModule('accountAuditor', moduleAccountAuditor)
        this.$store.dispatch('accountAuditor/FETCH_RECORDS', { type: this.type }).catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAuditor')) this.$store.unregisterModule('accountAuditor')
    },
    
    methods: {
      async changeRecordStatus (value) {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAuditor/FETCH_RECORDS', { type: this.type })
        loadingInstance.close()
      },
      
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAuditor/FETCH_RECORDS', { type: this.type })
        loadingInstance.close()
      },
      
      handleAudit (row) {
        window.open(`/audit/${this.type}/${row.recordId}`, '_blank')
      },
      
      handleCheck (row) {
        window.open(`/audit/${this.type}/${row.recordId}/check`, '_blank')
      },
      
      handleBrowse (row) {
        window.open(`/entry/${this.type}/${row.entryId}`, '_blank')
      },
      
      async handlePreview (row) {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.fetchRecord(this.type, row.recordId)
        const entry = this.$store.state.record[this.type][row.recordId]
        setPreview(JSON.stringify(entry))
        window.open(`/preview/${this.type}`, '_blank')
        loadingInstance.close()
      },
      
      async fetchRecord (type, id) {
        switch (type) {
          case 'animes':
            await this.$store.dispatch('accountAuditor/FETCH_ANIME_RECORD', { id })
            break
          case 'persons':
            await this.$store.dispatch('accountAuditor/FETCH_PERSON_RECORD', { id })
            break
        }
      }
    }
  }
</script>

<style>
</style>