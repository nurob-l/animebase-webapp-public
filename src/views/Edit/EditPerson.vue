<template>
  <el-main class="view">
    <el-form label-width="105px" class="form-box">
      <el-form-item>
        <h1 class="title">基本信息</h1>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="typePerson">
          <el-radio v-for="type in businessTypePersons" :key="type.value" :label="type.value">
            {{ type.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="封面">
        <EditItemCover fatherType="editPerson"></EditItemCover>
      </el-form-item>
      <el-form-item label="中文名">
        <el-input v-model="chineseName"></el-input>
      </el-form-item>
      <el-form-item label="外文(原)名">
        <el-input v-model="foreignName"></el-input>
      </el-form-item>
      <el-form-item label="别名">
        <transition-group name="list-complete" tag="div">
          <EditItemOtherName v-for="(value, id, index) in otherNames" :key="id" :id="id" fatherType="editPerson" class="list-complete-item"></EditItemOtherName>
        </transition-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="addOtherName()">新增别名</el-button>
      </el-form-item>
      <el-form-item :label="typePerson | birthdayCall">
        <el-date-picker v-model="birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="typePerson | birthplaceCall">
        <el-input v-model="birthplace"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" :autosize="{minRows: 5}" v-model="intro"></el-input>
      </el-form-item>
      <el-form-item v-if="typePerson !== valueOfPersonHuman">
        <h1 class="title">成员</h1>
      </el-form-item>
      <el-form-item v-if="typePerson !== valueOfPersonHuman">
        <EditItemMember></EditItemMember>
      </el-form-item>
      <el-form-item v-if="entryId" label="修改原因">
        <el-input type="textarea" :autosize="{minRows: 5}" v-model="submitterMessage" placeholder="请填写修改条目原因"></el-input>
      </el-form-item>
      <el-form-item class="button-group">
        <EditItemButtonGroup
          @submit="submit()"
          @preview="preview()"
          @save="save()"
          @remove="remove()"></EditItemButtonGroup>
      </el-form-item>
    </el-form>
    <el-backtop>
      <el-icon name="caret-top"></el-icon>
    </el-backtop>
  </el-main>
</template>

<script>
  import { Form, FormItem, Input, Button, RadioGroup, Radio, DatePicker, Loading, Backtop, Icon } from 'element-ui'
  import EditItemCover from './public/EditItemCover'
  import EditItemOtherName from './public/EditItemOtherName'
  import EditItemButtonGroup from './public/EditItemButtonGroup'
  import EditItemMember from './private/EditItemMember'
  import moduleEditPerson from '@/store/modules/edit/editPerson'
  import { setPreview } from '@/util/preview'
  
  export default {
    name: 'EditPerson',
    
    metaInfo: {
      title: '编辑人物条目'
    },
    
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
      'el-radio-group': RadioGroup,
      'el-radio': Radio,
      'el-date-picker': DatePicker,
      'el-backtop': Backtop,
      'el-icon': Icon,
      EditItemCover,
      EditItemOtherName,
      EditItemButtonGroup,
      EditItemMember
    },
    
    asyncData ({ store, route }) {
      if (!store.hasModule('editPerson')) store.registerModule('editPerson', moduleEditPerson)
      return store.state.activeRecordIdForEdit
        ? store.dispatch('editPerson/FETCH_LOCAL_RECORD', { id: store.state.activeRecordIdForEdit })
        : store.dispatch('editPerson/FETCH_DRAFT').catch(err => err)
    },
    
    beforeMount () {
      if (!this.$store.hasModule('editPerson')) {
        this.$store.registerModule('editPerson', moduleEditPerson)
        // 客户端渲染下无需执行FETCH_LOCAL_RECORD
        this.$store.dispatch('editPerson/FETCH_DRAFT').catch(err => err)
      }
    },
    
    // 重要信息：当多次访问路由时，
    // 避免在客户端重复注册模块。
    destroyed () {
      if (this.$store.hasModule('editPerson')) this.$store.unregisterModule('editPerson')
    },
    
    computed: {
      businessTypePersons () {
        return this.$store.state.business.typePersons
      },
      valueOfPersonHuman () {
        return this.$store.getters['business/valueOfPersonHuman']
      },
      entryId () {
        return this.$store.state.editPerson.entryId
      },
      typePerson: {
        get () {
          return this.$store.state.editPerson.typePerson
        },
        set (value) {
          this.$store.commit('editPerson/SET_TYPE_PERSON', { value })
        }
      },
      chineseName: {
        get () {
          return this.$store.state.editPerson.chineseName
        },
        set (value) {
          this.$store.commit('editPerson/SET_CHINESE_NAME', { value })
        }
      },
      foreignName: {
        get () {
          return this.$store.state.editPerson.foreignName
        },
        set (value) {
          this.$store.commit('editPerson/SET_FOREIGN_NAME', { value })
        }
      },
      otherNames () {
        return this.$store.state.editPerson.otherNames
      },
      birthday: {
        get () {
          return this.$store.state.editPerson.birthday
        },
        set (value) {
          this.$store.commit('editPerson/SET_BIRTHDAY', { value })
        }
      },
      birthplace: {
        get () {
          return this.$store.state.editPerson.birthplace
        },
        set (value) {
          this.$store.commit('editPerson/SET_BIRTHPLACE', { value })
        }
      },
      intro: {
        get () {
          return this.$store.state.editPerson.intro
        },
        set (value) {
          this.$store.commit('editPerson/SET_INTRO', { value })
        }
      },
      submitterMessage: {
        get () {
          return this.$store.state.editPerson.submitterMessage
        },
        set (value) {
          this.$store.commit('editPerson/SET_SUBMITTER_MESSAGE', { value })
        }
      }
    },
    
    methods: {
      // 添加别名
      addOtherName () {
        this.$store.commit('editPerson/ADD_OTHER_NAME')
      },
      
      // 提交条目
      async submit () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('editPerson/SUBMIT')
          this.$message.success('提交成功，审核通过后将会公开。')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      // 保存条目
      async save () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('editPerson/SAVE')
          this.$message.success('保存成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      // 预览
      preview () {
        // 格式化预览数据
        let entry = Object.assign({}, this.$store.state.editPerson, { coverUrl: this.$store.state.editPerson.cover.coverUrl })
        setPreview(JSON.stringify(entry))
        window.open('/preview/persons', '_blank')
      },
      
      // 删除草稿
      async remove () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('editPerson/DELETE')
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/main"
  @import "@/assets/css/edit"
</style>