<template>
  <el-table :data="casts" stripe fit border>
    <el-table-column label="角色" align="center">
      <el-table-column prop="characterId" label="绑定id" align="center"></el-table-column>
      <el-table-column prop="characterName" label="名字" align="center"></el-table-column>
    </el-table-column>
    <el-table-column label="配音" align="center">
      <el-table-column prop="personId" label="绑定id" align="center"></el-table-column>
      <el-table-column prop="personName" label="名字" align="center"></el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn } from 'element-ui'
  
  export default {
    name: 'AuditItemCast',
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn
    },
    
    computed: {
      casts () {
        return this.$store.state.auditAnime.casts
      }
    }
  }
</script>

<style>
</style>