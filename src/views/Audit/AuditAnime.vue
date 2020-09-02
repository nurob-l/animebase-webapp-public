<template>
  <el-main class="view" v-if="isAuditor">
    <el-form label-width="105px" class="form-box">
      <el-form-item>
        <h1 class="title">基本信息</h1>
      </el-form-item>
      <el-form-item label="封面">
        <AuditItemCover fatherType="auditAnime"></AuditItemCover>
      </el-form-item>
      <el-form-item label="中文名">{{ chineseName }}</el-form-item>
      <el-form-item label="外文(原)名">{{ foreignName }}</el-form-item>
      <el-form-item label="别名">
        <div v-for="(value, id, index) in otherNames">{{ value }}</div>
      </el-form-item>
      <el-form-item label="媒介">{{ typeMedium | mediumLabel }}</el-form-item>
      <el-form-item label="来源">{{ typeSource | sourceLabel }}</el-form-item>
      <el-form-item label="题材">
        <span v-for="(value, index) in typeGenres">{{ index ? ' / ' : '' }}{{ value | genreLabel }}</span>
      </el-form-item>
      <el-form-item label="制片国家/地区">
        <span v-for="(value, index) in regions">{{ index ? ' / ' : '' }}{{ value | regionLabel }}</span>
      </el-form-item>
      <el-form-item :label="typeMedium | releaseCall">
        <span v-for="(releaseDate, id, index) in releaseDates">{{ index ? ' / ' : '' }}{{ releaseDate | dateStirng }}</span>
      </el-form-item>
      <el-form-item label="网络播放">
        <span v-for="(value, index) in copyrights">{{ index ? ' / ' : '' }}{{ value | copyrightLabel }}</span>
      </el-form-item>
      <el-form-item label="官网链接">{{ officialUrl }}</el-form-item>
      <el-form-item label="简介"><pre class="intro">{{ intro }}</pre></el-form-item>
      <el-form-item>
        <h1 class="title">制作 Staff</h1>
      </el-form-item>
      <el-form-item>
        <AuditItemStaff></AuditItemStaff>
      </el-form-item>
      <el-form-item>
        <h1 class="title">阵容 Cast</h1>
      </el-form-item>
      <el-form-item prop="cast">
        <AuditItemCast></AuditItemCast>
      </el-form-item>
      <el-form-item v-if="entryId" label="修改原因">{{ submitterMessage }}</el-form-item>
      <el-form-item class="button-group">
        <AuditItemButtonGroup
          v-if="!isChecking"
          fatherType="auditAnime"
          @preview="preview()"
          @approve="approve()"
          @deny="deny()"></AuditItemButtonGroup>
      </el-form-item>
    </el-form>
    <el-backtop>
      <el-icon name="caret-top"></el-icon>
    </el-backtop>
  </el-main>
</template>

<script>
  import { Form, FormItem, Backtop, Icon, Loading } from 'element-ui'
  import AuditItemCover from './public/AuditItemCover'
  import AuditItemButtonGroup from './public/AuditItemButtonGroup'
  import AuditItemStaff from './private/AuditItemStaff'
  import AuditItemCast from './private/AuditItemCast'
  import moduleAuditAnime from '@/store/modules/audit/auditAnime'
  import { setPreview } from '@/util/preview'
  
  export default {
    name: 'AuditAnime',
    
    metaInfo: {
      title: '审核动画条目'
    },
    
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-backtop': Backtop,
      'el-icon': Icon,
      AuditItemCover,
      AuditItemButtonGroup,
      AuditItemStaff,
      AuditItemCast
    },
    
    props: {
      id: {
        type: String,
        required: true,
        validator: value => parseInt(value) > 0
      }
    },
    
    data() {
      return {
        isChecking: false
      }
    },
    
    beforeMount () {
      if (this.$route.params.pathMatch === '/check') this.isChecking = true
      this.$store.registerModule('auditAnime', moduleAuditAnime)
      this.$store.dispatch('auditAnime/FETCH_RECORD', { id: this.id }).catch(err => err)
    },
    
    // 重要信息：当多次访问路由时，
    // 避免在客户端重复注册模块。
    destroyed () {
      this.$store.unregisterModule('auditAnime')
    },
    
    computed: {
      isAuditor () {
        return this.$store.getters['user/isAuditor']
      },
      entryId () {
        return this.$store.state.auditAnime.entryId
      },
      chineseName () {
        return this.$store.state.auditAnime.chineseName
      },
      foreignName () {
        return this.$store.state.auditAnime.foreignName
      },
      otherNames () {
        return this.$store.state.auditAnime.otherNames
      },
      typeMedium () {
        return this.$store.state.auditAnime.typeMedium
      },
      typeSource () {
        return this.$store.state.auditAnime.typeSource
      },
      typeGenres () {
        return this.$store.state.auditAnime.typeGenres
      },
      regions () {
        return this.$store.state.auditAnime.regions
      },
      releaseDates () {
        return this.$store.state.auditAnime.releaseDates
      },
      copyrights () {
        return this.$store.state.auditAnime.copyrights
      },
      officialUrl () {
        return this.$store.state.auditAnime.officialUrl
      },
      intro () {
        return this.$store.state.auditAnime.intro
      },
      submitterMessage () {
        return this.$store.state.auditAnime.submitterMessage
      }
    },
    
    methods: {
      // 预览
      preview () {
        let entry = this.$store.state.auditAnime
        setPreview(JSON.stringify(entry))
        window.open('/preview/animes', '_blank')
      },
      
      // 审核通过
      async approve (reason) {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('auditAnime/APPROVE', { id: this.id })
          this.$message.success('审核成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      // 审核不通过
      async deny (reason) {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('auditAnime/DENY', { id: this.id })
          this.$message.success('审核成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  @import "@/assets/css/edit"
  @import "@/assets/css/entry"
</style>