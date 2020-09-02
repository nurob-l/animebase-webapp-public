<template>
  <el-pagination
    class="pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 25, 50, 100]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</template>

<script>
  import { Pagination } from 'element-ui'
  
  export default {
    name: 'Pagination',
    
    components: {
      'el-pagination': Pagination
    },
    
    props: {
      fatherType: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'accountEditor',
            'accountAuditor',
            'accountAdminAnimeRecord',
            'accountAdminAnime',
            'accountAdminAnimeOtherName',
            'accountAdminAnimeTypeGenre',
            'accountAdminAnimeRegion',
            'accountAdminAnimeReleaseDate',
            'accountAdminAnimeCopyright',
            'accountAdminAnimeStaff',
            'accountAdminAnimeCast',
            'accountAdminPersonRecord',
            'accountAdminDictionaryPosition',
            'accountAdminDictionaryPerson'
          ].indexOf(value) !== -1
        }
      }
    },
    
    computed: {
      total () {
        return this.$store.state[this.fatherType].pagination.total
      },
      pageSize () {
        return this.$store.state[this.fatherType].pagination.pageSize
      },
      currentPage () {
        return this.$store.state[this.fatherType].pagination.currentPage
      }
    },
    
    methods: {
      handleSizeChange (value) {
        this.$store.commit(`${this.fatherType}/pagination/SET_PAGE_SIZE`, { value })
        this.$emit('sizeChange')
      },
      
      handleCurrentChange (value) {
        this.$store.commit(`${this.fatherType}/pagination/SET_CURRENT_PAGE`, { value })
        this.$emit('currentChange')
      }
    }
  }
</script>

<style lang="sass">
  .pagination
    margin: 10px
    text-align: center
</style>
