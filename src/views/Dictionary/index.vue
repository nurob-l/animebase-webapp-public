<template>
  <el-main class="view">
    <el-col :span="12">
      <el-header>
        <h1 class="center">职位</h1>
      </el-header>
      <el-main>
        <el-table :data="positions" stripe fit border>
          <el-table-column label="职位" align="center">
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column prop="cn" label="中文" align="center"></el-table-column>
            <el-table-column prop="jp" label="日文" align="center"></el-table-column>
          </el-table-column>
        </el-table>
      </el-main>
    </el-col>
    <el-col :span="12">
      <el-header>
        <h1 class="center">人物/团体</h1>
      </el-header>
      <el-main>
        <el-table :data="persons" stripe fit border>
          <el-table-column label="人物/团体" align="center">
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column prop="cn" label="中文" align="center"></el-table-column>
            <el-table-column prop="jp" label="日文" align="center"></el-table-column>
          </el-table-column>
        </el-table>
      </el-main>
    </el-col>
  </el-main>
</template>

<script>
  import { Col, Table, TableColumn } from 'element-ui'
  
  export default {
    name: 'Dictionary',
    
    metaInfo: {
      title: '动画相关名词表'
    },
    
    components: {
      'el-col': Col,
      'el-table': Table,
      'el-table-column': TableColumn
    },
    
    asyncData ({ store }) {
      return Promise.all([
        store.dispatch('FETCH_DICTIONARY', { type: 'positions' }),
        store.dispatch('FETCH_DICTIONARY', { type: 'persons' })
      ])
    },
    
    computed: {
      positions () {
        return this.$store.state.dictionary['positions']
      },
      persons () {
        return this.$store.state.dictionary['persons']
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/main"
</style>
