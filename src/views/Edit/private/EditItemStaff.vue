<template>
  <div>
    <el-table :data="staffs" stripe fit border>
      <el-table-column label="职位" align="center">
        <template slot-scope="scope">
          <el-input :value="scope.row.positionName" @input="update(scope.$index, 'positionName', $event)"
            placeholder="示例: 导演" :maxlength="staffNameMaxLength" show-word-limit></el-input>
        </template>
      </el-table-column>
      <el-table-column label="人员" align="center">
        <el-table-column label="绑定id" align="center">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="选填" width="200" trigger="hover" content="绑定对应人物的id后可显示该人物封面，并且点击封面可跳转到该人物页面">
              <el-input slot="reference" :value="scope.row.personId" @input="update(scope.$index, 'personId', $event)" type="number" min="1" placeholder="没有可不填"></el-input>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="名字" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.personName" @input="update(scope.$index, 'personName', $event)"
              placeholder="示例: 渡边信一郎" :maxlength="staffNameMaxLength" show-word-limit></el-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="moveUp(scope.$index)" :disabled="scope.$index === 0">上移</el-button>
          <el-button size="mini" @click="moveDown(scope.$index)" :disabled="scope.$index === staffs.length - 1">下移</el-button>
          <el-button size="mini" @click="insert(scope.$index)">插入</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="el-table-add-row" @click="add()"><span>+ 添加</span></div>
    <EditItemStaffBatchFill @batchFill="batchFill($event)"></EditItemStaffBatchFill>
  </div>
</template>

<script>
  import { Table, TableColumn, Popover, Input, Button } from 'element-ui'
  import EditItemStaffBatchFill from './EditItemStaffBatchFill'
  
  export default {
    name: 'EditItemStaff',
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-popover': Popover,
      'el-input': Input,
      'el-button': Button,
      EditItemStaffBatchFill
    },
    
    computed: {
      staffNameMaxLength () {
        return this.$store.state.business.staffNameMaxLength
      },
      staffs () {
        return this.$store.state.editAnime.staffs
      }
    },
    
    methods: {
      update (index, prop, value) {
        this.$store.commit('editAnime/SET_STAFF', { index, prop, value })
      },
      
      // 上移表项
      moveUp (index) {
        this.$store.commit('editAnime/MOVE_UP_STAFF', { index })
      },
      
      // 下移表项
      moveDown (index) {
        this.$store.commit('editAnime/MOVE_DOWN_STAFF', { index })
      },
      
      // 插入表项
      insert (index) {
        this.$store.commit('editAnime/INSERT_STAFF', { index })
      },
      
      // 删除表项
      remove (index) {
        this.$store.commit('editAnime/DELETE_STAFF', { index })
      },
      
      // 添加表项
      add () {
        this.$store.commit('editAnime/ADD_STAFF')
      },
      
      // 批量填充表格
      batchFill(dataString) {
        let value = []
        // 将每行分割成数组
        let dataArray = dataString.split(/[\f\n\r\v]/)
        dataArray.forEach(data => {
          if (!data) return
          let item = data.split(/[:：]/)
          value.push({
            positionName: item[0],
            personName: item[1]
          })
        })
        this.$store.commit('editAnime/SET_STAFFS', { value })
      }
    }
  }
</script>

<style>
</style>