<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <el-radio-group v-model="currentRecordStatus" @change="changeRecordStatus" class="account-header-item">
        <el-radio :label="'all'">全部</el-radio>
        <el-radio v-for="s in recordStatus" :key="s.value" :label="s.value">
          {{ s.label }}
        </el-radio>
      </el-radio-group>
      <span>动画档案</span>
    </el-header>
    <el-main class="account-main">
      <el-table :data="table">
        <el-table-column prop="recordId" label="审核id" align="center"></el-table-column>
        <el-table-column prop="entry_id" label="条目id" align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.entryId" :href="`/entry/animes/${scope.row.entryId}`" target="_blank">
              {{ scope.row.entryId }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.chineseName ? scope.row.chineseName : scope.row.foreignName }}
          </template>
        </el-table-column>
        <el-table-column prop="submitterId" label="编辑员id" align="center"></el-table-column>
        <el-table-column prop="submitterMessage" label="提交说明" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" width="160" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | recordStatusTagType" disable-transitions>
              {{ scope.row.status | recordStatusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="auditorId" label="审核员id" align="center">
          <template slot-scope="scope">
            {{ scope.row.auditorId || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="auditedAt" label="审核时间" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.auditorId ? scope.row.auditedAt : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="auditorMessage" label="备注" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="130" align="center">
          <template slot-scope="scope">
            <el-button @click="handleCheck(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleBrowse(scope.row)" type="text" size="small" v-if="scope.row.status === success">浏览</el-button>
            <el-button @click="handlePreview(scope.row)" type="text" size="small" v-else>预览</el-button>
            <el-dropdown style="margin-left: 10px;" trigger="click">
              <el-button type="text" size="small">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.status === success">
                  <el-button type="text" size="small" @click="handleClose(scope.row)">下架</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status === closed">
                  <el-button type="text" size="small" @click="handleOpen(scope.row)">上架</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status === success">
                  <el-button type="text" size="small" @click="handleRollback(scope.row)">回滚</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status !== success">
                  <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnimeRecord"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { RadioGroup, Radio, Table, TableColumn, Button, Tag, Dropdown, DropdownMenu, DropdownItem, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnimeRecord from '@/store/modules/account/admin/accountAdminAnimeRecord'
  import { setPreview } from '@/util/preview'
  
  export default {
    name: 'AccountAdminAnimeRecord',
    
    metaInfo: {
      title: '动画档案'
    },
    
    components: {
      'el-radio-group': RadioGroup,
      'el-radio': Radio,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'el-tag': Tag,
      'el-dropdown': Dropdown,
      'el-dropdown-menu': DropdownMenu,
      'el-dropdown-item': DropdownItem,
      Pagination
    },
    
    computed: {
      recordStatus () {
        return this.$store.state.business.recordStatus
      },
      isAdmin () {
        return this.$store.getters['user/isAdmin']
      },
      success () {
        return this.$store.getters['business/valueOfRecordStatusSuccess']
      },
      closed () {
        return this.$store.getters['business/valueOfRecordStatusClosed']
      },
      table () {
        return this.$store.state.accountAdminAnimeRecord.table
      },
      currentRecordStatus: {
        get () {
          return this.$store.state.accountAdminAnimeRecord.currentRecordStatus
        },
        set (value) {
          this.$store.commit('accountAdminAnimeRecord/SET_CURRENT_RECORD_STATUS', { value })
        }
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnimeRecord')) store.registerModule('accountAdminAnimeRecord', moduleAccountAdminAnimeRecord)
      return store.dispatch('accountAdminAnimeRecord/FETCH_ANIME_RECORDS').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnimeRecord')) {
        this.$store.registerModule('accountAdminAnimeRecord', moduleAccountAdminAnimeRecord)
        this.$store.dispatch('accountAdminAnimeRecord/FETCH_ANIME_RECORDS').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnimeRecord')) this.$store.unregisterModule('accountAdminAnimeRecord')
    },
    
    methods: {
      async changeRecordStatus (value) {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeRecord/FETCH_ANIME_RECORDS')
        loadingInstance.close()
      },
      
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeRecord/FETCH_ANIME_RECORDS')
        loadingInstance.close()
      },
      
      // 查看条目，需要审核员权限
      handleCheck (row) {
        window.open(`/audit/animes/${row.recordId}/check`, '_blank')
      },
      
      handleBrowse (row) {
        window.open(`/entry/animes/${row.entryId}`, '_blank')
      },
      
      async handlePreview (row) {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnimeRecord/FETCH_ANIME_RECORD', { id: row.recordId })
        const entry = this.$store.state.record.animes[row.recordId]
        setPreview(JSON.stringify(entry))
        window.open(`/preview/animes`, '_blank')
        loadingInstance.close()
      },
      
      async handleClose (row) {
        let result
        try {
          result = await this.$message.prompt('此操作将删除公开的条目信息, 是否继续?', '请填写下架原因')
        } catch (err) {}
        if (!result) return
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('accountAdminAnimeRecord/CLOSE', { id: row.recordId, message: result.value })
          this.$message.success('下架成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      async handleOpen (row) {
        let result
        try {
          result = await this.$message.confirm('此操作将公开条目信息, 是否继续?')
        } catch (err) {}
        if (!result) return
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('accountAdminAnimeRecord/OPEN', { id: row.recordId })
          this.$message.success('上架成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      async handleRollback (row) {
        let result
        try {
          result = await this.$message.prompt('此操作将回滚到上一版本条目，且本条目档案将变为不通过状态, 是否继续?', '请填写回滚原因')
        } catch (err) {}
        if (!result) return
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('accountAdminAnimeRecord/ROLLBACK', { id: row.recordId, message: result.value })
          this.$message.success('回滚成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      async handleDelete (row) {
        let result
        try {
          result = await this.$message.confirm('此操作将永久删除该条目档案, 是否继续?')
        } catch (err) {}
        if (!result) return
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('accountAdminAnimeRecord/DELETE', { id: row.recordId })
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      }
    }
  }
</script>

<style>
</style>