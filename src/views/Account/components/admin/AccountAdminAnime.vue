<template>
  <el-container v-if="isAdmin">
    <el-header class="account-header">
      <span>动画</span>
    </el-header>
    <el-main class="account-main">
      <el-table :data="table">
        <el-table-column label="条目id" align="center" sortable>
          <template slot-scope="scope">
            <a :href="`/entry/animes/${scope.row.entryId}`" target="_blank">
              {{ scope.row.entryId }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="封面" min-width="130" align="center">
          <template slot-scope="scope">
            <a :href="`/entry/animes/${scope.row.entryId}`" target="_blank">
              <img class="account-admin-entry-cover" :src="scope.row.entryId | animeCoverUrl" />
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="chineseName" label="中文名" min-width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="foreignName" label="外文名" min-width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="媒介" align="center">
          <template slot-scope="scope">{{ scope.row.typeMedium | mediumLabel }}</template>
        </el-table-column>
        <el-table-column label="来源" align="center">
          <template slot-scope="scope">{{ scope.row.typeSource | sourceLabel }}</template>
        </el-table-column>
        <el-table-column prop="officialUrl" label="官网" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="intro" label="简介" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="最早放送时间" min-width="90" align="center">
          <template slot-scope="scope">
            {{ {
              year: scope.row.earliestYear,
              month: scope.row.earliestMonth,
              day: scope.row.earliestDay
            } | dateStirng }}
          </template>
        </el-table-column>
        <el-table-column prop="scoreStory" label="故事" align="center"></el-table-column>
        <el-table-column prop="scoreCharacter" label="角色" align="center"></el-table-column>
        <el-table-column prop="scoreMake" label="作画" align="center"></el-table-column>
        <el-table-column prop="scoreShow" label="演出" align="center"></el-table-column>
        <el-table-column prop="scoreMusic" label="音乐" align="center"></el-table-column>
        <el-table-column prop="scoreAvg" label="综合" align="center"></el-table-column>
        <el-table-column prop="numberRecommends" label="推荐人数" align="center"></el-table-column>
        <el-table-column prop="numberScores" label="评分人数" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleBrowse(scope.row)" type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        fatherType="accountAdminAnime"
        @sizeChange="paginationChange()"
        @currentChange="paginationChange()">
      </Pagination>
    </el-main>
  </el-container>
</template>

<script>
  import { Table, TableColumn, Button, Loading } from 'element-ui'
  import Pagination from '@/components/Pagination'
  import moduleAccountAdminAnime from '@/store/modules/account/admin/accountAdminAnime'
  
  export default {
    name: 'AccountAdminAnime',
    
    metaInfo: {
      title: '动画'
    },
    
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-button': Button,
      Pagination
    },
    
    computed: {
      isAdmin () {
        return this.$store.getters['user/isAdmin']
      },
      table () {
        return this.$store.state.accountAdminAnime.table
      }
    },
    
    asyncData ({ store }) {
      if (!store.hasModule('accountAdminAnime')) store.registerModule('accountAdminAnime', moduleAccountAdminAnime)
      return store.dispatch('accountAdminAnime/FETCH_ANIMES').catch(err => console.error(err))
    },
    
    beforeMount () {
      if (!this.$store.hasModule('accountAdminAnime')) {
        this.$store.registerModule('accountAdminAnime', moduleAccountAdminAnime)
        this.$store.dispatch('accountAdminAnime/FETCH_ANIMES').catch(err => this.$message.error(err))
      }
    },
    
    destroyed () {
      if (this.$store.hasModule('accountAdminAnime')) this.$store.unregisterModule('accountAdminAnime')
    },
    
    methods: {
      async paginationChange () {
        let loadingInstance = Loading.service({ fullscreen: true })
        await this.$store.dispatch('accountAdminAnime/FETCH_ANIMES')
        loadingInstance.close()
      },
      
      handleBrowse (row) {
        window.open(`/entry/animes/${row.entryId}`, '_blank')
      }
    }
  }
</script>

<style lang="sass">
  // 限制简介intro的提示框宽度
  .el-tooltip__popper
    max-width: 500px
  // 封面
  .account-admin-entry-cover
    width: 112.5px
    height: 160px
</style>