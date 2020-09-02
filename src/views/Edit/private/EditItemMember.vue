<template>
  <div>
    <el-table :data="members" stripe fit border>
      <el-table-column label="位置/职位" align="center">
        <template slot-scope="scope">
          <el-input :value="scope.row.positionName" @input="update(scope.$index, 'positionName', $event)" placeholder="示例: CEO"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="成员" align="center">
        <el-table-column label="绑定id" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.personId" @input="update(scope.$index, 'personId', $event)" type="number" min="1" placeholder="没有可不填"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="名字" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.personName" @input="update(scope.$index, 'personName', $event)" placeholder="示例: 渡边信一郎"></el-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="moveUp(scope.$index)" :disabled="scope.$index === 0">上移</el-button>
          <el-button size="mini" @click="moveDown(scope.$index)" :disabled="scope.$index === members.length - 1">下移</el-button>
          <el-button size="mini" @click="insert(scope.$index)">插入</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="el-table-add-row" @click="add()"><span>+ 添加</span></div>
    <EditItemMemberBatchFill @batchFill="batchFill($event)"></EditItemMemberBatchFill>
  </div>
</template>

<script>
  import { Table, TableColumn, Input, Button } from 'element-ui'
  import EditItemMemberBatchFill from './EditItemMemberBatchFill'
  
  export default {
    name: 'EditItemMember',
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-input': Input,
      'el-button': Button,
      EditItemMemberBatchFill
    },
    
    computed: {
      members () {
        return this.$store.state.editPerson.members
      }
    },
    
    methods: {
      update (index, prop, value) {
        this.$store.commit('editPerson/SET_MEMBER', { index, prop, value })
      },
      
      // 上移表项
      moveUp (index) {
        this.$store.commit('editPerson/MOVE_UP_MEMBER', { index })
      },
      
      // 下移表项
      moveDown (index) {
        this.$store.commit('editPerson/MOVE_DOWN_MEMBER', { index })
      },
      
      // 插入表项
      insert (index) {
        this.$store.commit('editPerson/INSERT_MEMBER', { index })
      },
      
      // 删除表项
      remove (index) {
        this.$store.commit('editPerson/DELETE_MEMBER', { index })
      },
      
      // 添加表项
      add () {
        this.$store.commit('editPerson/ADD_MEMBER')
      },
      
      // 批量填充表格
      batchFill(dataString) {
        let value = []
        // 将每行分割成数组
        let dataArray = dataString.split(/[\f\n\r\v]/)
        dataArray.forEach(data => {
          if(!data) return
          let item = data.split(/[:：]/)
          value.push({
            positionName: item[0],
            personName: item[1]
          })
        })
        this.$store.commit('editPerson/SET_MEMBERS', { value })
      }
    }
  }
</script>

<style>
</style>