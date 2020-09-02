<template>
  <el-main class="view" v-if="isAuditor">
    <el-form label-width="105px" class="form-box">
      <el-form-item>
        <h1 class="title">基本信息</h1>
      </el-form-item>
      <el-form-item label="类型">{{ typePerson | personLabel }}</el-form-item>
      <el-form-item label="封面">
        <AuditItemCover fatherType="auditPerson"></AuditItemCover>
      </el-form-item>
      <el-form-item label="中文名">{{ chineseName }}</el-form-item>
      <el-form-item label="外文(原)名">{{ foreignName }}</el-form-item>
      <el-form-item label="别名">
        <div v-for="(value, id, index) in otherNames">{{ value }}</div>
      </el-form-item>
      <el-form-item :label="typePerson | birthdayCall">
        <!-- <el-date-picker v-model="birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker> -->
        {{ birthday }}
      </el-form-item>
      <el-form-item :label="typePerson | birthplaceCall">{{ birthplace }}</el-form-item>
      <el-form-item label="简介"><pre class="intro">{{ intro }}</pre></el-form-item>
      <el-form-item v-if="typePerson !== valueOfPersonHuman">
        <h1 class="title">成员</h1>
      </el-form-item>
      <el-form-item v-if="typePerson !== valueOfPersonHuman">
        <AuditItemMember></AuditItemMember>
      </el-form-item>
      <el-form-item v-if="entryId" label="修改原因">{{ submitterMessage }}</el-form-item>
      <el-form-item class="button-group">
        <AuditItemButtonGroup
          v-if="!isChecking"
          fatherType="auditPerson"
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
  import AuditItemMember from './private/AuditItemMember'
  import moduleAuditPerson from '@/store/modules/audit/auditPerson'
  import { setPreview } from '@/util/preview'
  
  export default {
    name: 'AuditPerson',
    
    metaInfo: {
      title: '审核人物条目'
    },
    
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-backtop': Backtop,
      'el-icon': Icon,
      AuditItemCover,
      AuditItemButtonGroup,
      AuditItemMember
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
      this.$store.registerModule('auditPerson', moduleAuditPerson)
      this.$store.dispatch('auditPerson/FETCH_RECORD', { id: this.id }).catch(err => err)
    },
    
    // 重要信息：当多次访问路由时，
    // 避免在客户端重复注册模块。
    destroyed () {
      this.$store.unregisterModule('auditPerson')
    },
    
    computed: {
      isAuditor () {
        return this.$store.getters['user/isAuditor']
      },
      valueOfPersonHuman () {
        return this.$store.getters['business/valueOfPersonHuman']
      },
      entryId () {
        return this.$store.state.auditPerson.entryId
      },
      typePerson () {
        return this.$store.state.auditPerson.typePerson
      },
      chineseName () {
        return this.$store.state.auditPerson.chineseName
      },
      foreignName () {
        return this.$store.state.auditPerson.foreignName
      },
      otherNames () {
        return this.$store.state.auditPerson.otherNames
      },
      birthday () {
        return this.$store.state.auditPerson.birthday
      },
      birthplace () {
        return this.$store.state.auditPerson.birthplace
      },
      intro () {
        return this.$store.state.auditPerson.intro
      },
      submitterMessage () {
        return this.$store.state.auditPerson.submitterMessage
      }
    },
    
    methods: {
      // 预览
      preview () {
        let entry = this.$store.state.auditPerson
        setPreview(JSON.stringify(entry))
        window.open('/preview/persons', '_blank')
      },
      
      // 审核通过
      async approve (reason) {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('auditPerson/APPROVE', { id: this.id })
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
          await this.$store.dispatch('auditPerson/DENY', { id: this.id })
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