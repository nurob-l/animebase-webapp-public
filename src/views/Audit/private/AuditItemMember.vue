<template>
  <el-table :data="members" stripe fit border>
    <el-table-column prop="positionName" label="位置/职位" align="center"></el-table-column>
    <el-table-column label="成员" align="center">
      <el-table-column prop="personId" label="绑定id" align="center"></el-table-column>
      <el-table-column prop="personName" label="名字" align="center"></el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn } from 'element-ui'
  
  export default {
    name: 'AuditItemMember',
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn
    },
    
    computed: {
      members () {
        return this.$store.state.auditPerson.members
      }
    }
  }
</script>

<style>
</style>