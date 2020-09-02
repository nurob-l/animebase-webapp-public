<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <el-input placeholder="搜索词典" size="small" class="account-header-item account-header-search" v-model="content" @keyup.enter.native="search()">
        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
      </el-input>
      <el-button type="primary" icon="el-icon-edit" size="small" class="account-header-item" @click="dialogVisible = true">添加</el-button>
      <span>职位词典</span>
    </el-header>
    <el-main class="account-main">
      <el-table :data="table">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column label="中文" align="center">
          <template slot-scope="{ row }">
            <el-input v-if="row.editable" v-model="row.cn" size="small"></el-input>
            <span v-else>{{ row.cn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日文" align="center">
          <template slot-scope="{ row }">
            <el-input v-if="row.editable" v-model="row.jp" size="small"></el-input>
            <span v-else>{{ row.jp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <template v-if="row.editable">
              <el-button type="success" size="mini" @click="confirmEdit(row)">保存</el-button>
              <el-button type="warning" size="mini" @click="cancelEdit(row)">取消</el-button>
            </template>
            <el-button v-else type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
            <el-popover placement="top" v-model="row.deletePopoverVisible">
              <p>确定删除吗？</p>
              <div>
                <el-button size="mini" type="text" @click="row.deletePopoverVisible = false">取消</el-button>
                <el-button size="mini" type="primary" @click="confirmDelete(row)">确定</el-button>
              </div>
              <el-button type="danger" size="mini" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminDictionaryPosition"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
    <el-dialog title="添加词典" :visible.sync="dialogVisible">
      <el-form :model="position">
        <el-form-item label="中文">
          <el-input v-model="position.cn"></el-input>
        </el-form-item>
        <el-form-item label="日文">
          <el-input v-model="position.jp"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import { Input, Table, TableColumn, Button, Dialog, Form, FormItem, Popover, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminDictionaryPosition from '@/store/modules/account/admin/accountAdminDictionaryPosition'
  
  export default {
    name: 'AccountAdminDictionaryPosition',
    
    metaInfo: {
      title: '职位词典'
    },
    
    components: {
      'el-input': Input,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-popover': Popover,
      Pagination
    },
    
    data () {
      return {
        table: [],
        content: '',
        dialogVisible: false,
        position: {}
      }
    },
    
    computed: {
      isAdmin () {
        return this.$store.getters['user/isAdmin']
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminDictionaryPosition')) store.registerModule('accountAdminDictionaryPosition', moduleAccountAdminDictionaryPosition)
      return store.dispatch('accountAdminDictionaryPosition/FETCH_DICTIONARY_POSITIONS').catch(err => console.error(err))
    },
    
    async beforeMount () {
      if (!this.$store.hasModule('accountAdminDictionaryPosition')) {
        this.$store.registerModule('accountAdminDictionaryPosition', moduleAccountAdminDictionaryPosition)
        await this.$store.dispatch('accountAdminDictionaryPosition/FETCH_DICTIONARY_POSITIONS').catch(err => this.$message.error(err))
      }
      this.deepCopy()
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminDictionaryPosition')) this.$store.unregisterModule('accountAdminDictionaryPosition')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminDictionaryPosition/FETCH_DICTIONARY_POSITIONS')
        this.deepCopy()
        loadingInstance.close()
      },
      
      async search () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminDictionaryPosition/SEARCH_DICTIONARY_POSITIONS', { searchContent: this.content })
        this.deepCopy()
        loadingInstance.close()
      },
      
      async add () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('accountAdminDictionaryPosition/ADD_DICTIONARY_POSITION', { data: this.position })
          this.$message.success('添加成功')
          this.dialogVisible = false
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      // 深拷贝为了让table的数据可以直接编辑
      deepCopy () {
        this.table = []
        this.$store.state.accountAdminDictionaryPosition.table.forEach(item => this.table.push(Object.assign({ editable: false }, item)))
      },
      
      handleEdit (row) {
        row.originalCn = row.cn
        row.originalJp = row.jp
        row.editable = true
      },
      
      cancelEdit (row) {
        row.cn = row.originalCn
        row.jp = row.originalJp
        row.editable = false
      },
      
      async confirmEdit (row) {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('accountAdminDictionaryPosition/UPDATE_DICTIONARY_POSITION', { id: row.id, data: row })
          this.$message.success('修改成功')
          row.editable = false
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
    
      async confirmDelete (row) {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('accountAdminDictionaryPosition/DELETE_DICTIONARY_POSITION', { id: row.id })
          await this.$store.dispatch('accountAdminDictionaryPosition/FETCH_DICTIONARY_POSITIONS')
          this.deepCopy()
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