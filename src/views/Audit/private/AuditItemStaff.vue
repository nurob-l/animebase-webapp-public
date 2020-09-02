<template>
  <el-table :data="staffs" stripe fit border>
    <el-table-column prop="positionName" label="职位" align="center"></el-table-column>
    <el-table-column label="人员" align="center">
      <el-table-column prop="personId" label="绑定id" align="center"></el-table-column>
      <el-table-column prop="personName" label="名字" align="center"></el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn } from 'element-ui'
  
  export default {
    name: 'AuditItemStaff',
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn
    },
    
    computed: {
      staffs () {
        return this.$store.state.auditAnime.staffs
      }
    }
  }
</script>

<style>
</style>