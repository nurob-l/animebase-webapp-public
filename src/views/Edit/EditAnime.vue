<template>
  <el-main class="view">
    <el-form label-width="105px" class="form-box">
      <el-form-item>
        <h1 class="title">基本信息</h1>
      </el-form-item>
      <el-form-item label="封面">
        <el-popover placement="left-start" title="选填" width="200" trigger="hover" content="点击上传封面图片">
          <EditItemCover slot="reference" fatherType="editAnime"></EditItemCover>
        </el-popover>
      </el-form-item>
      <el-form-item label="中文名">
        <el-popover placement="left-start" title="必填/选填" width="200" trigger="hover"
          :content="`“中文名”或“外文(原)名”请至少填一项。${chineseNameMaxLength}字符以内，若字符不够请联系我们增加上限。`">
          <el-input slot="reference" v-model="chineseName" :maxlength="chineseNameMaxLength" show-word-limit></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="外文(原)名">
        <el-popover placement="left-start" title="必填/选填" width="200" trigger="hover"
          :content="`“中文名”或“外文(原)名”请至少填一项。${foreignNameMaxLength}字符以内，若字符不够请联系我们增加上限。`">
          <el-input slot="reference" v-model="foreignName" :maxlength="foreignNameMaxLength" show-word-limit></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="别名">
        <transition-group name="list-complete" tag="div">
          <EditItemOtherName v-for="(value, id, index) in otherNames" :key="id" :id="id" fatherType="editAnime" class="list-complete-item"></EditItemOtherName>
        </transition-group>
      </el-form-item>
      <el-form-item>
        <el-popover placement="left-start" title="选填" width="200" trigger="hover"
          :content="`添加别名。单个别名长度上限为${otherNameMaxLength}字符，所有别名的总长度上限为${otherNamesMaxLength}字符。`">
          <el-button slot="reference" @click="addOtherName()">新增别名</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="媒介">
        <el-popover placement="left-start" title="必填" width="200" trigger="hover" content="选择媒介类型">
          <el-radio-group slot="reference" v-model="typeMedium">
            <el-radio v-for="medium in businessTypeMediums" :key="medium.value" :label="medium.value">
              {{ medium.label }}
            </el-radio>
          </el-radio-group>
        </el-popover>
      </el-form-item>
      <el-form-item label="来源">
        <el-popover placement="left-start" title="必填" width="200" trigger="hover" content="选择改编来源">
          <el-radio-group slot="reference" v-model="typeSource">
            <el-radio v-for="source in businessTypeSources" :key="source.value" :label="source.value">
              {{ source.label }}
            </el-radio>
          </el-radio-group>
        </el-popover>
      </el-form-item>
      <el-form-item label="题材">
        <el-popover placement="left-start" title="选填" width="200" trigger="hover" content="选择题材，可多选">
          <el-select slot="reference" v-model="typeGenres" multiple filterable default-first-option placeholder="请选择">
            <el-option v-for="genre in businessTypeGenres" :key="genre.value" :label="genre.label" :value="genre.value">
            </el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="制片国家/地区">
        <el-popover placement="left-start" title="选填" width="200" trigger="hover" content="选择制片国家/地区，可多选，若选项不够请联系我们添加。">
          <el-select slot="reference" v-model="regions" multiple filterable default-first-option placeholder="请选择">
            <el-option v-for="region in businessRegions" :key="region.value" :label="region.label" :value="region.value">
            </el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item :label="typeMedium | releaseCall">
        <transition-group name="list-complete" tag="div">
          <EditItemReleaseDate v-for="(value, id, index) in releaseDates" :key="id" :id="id" class="list-complete-item"></EditItemReleaseDate>
        </transition-group>
      </el-form-item>
      <el-form-item>
        <el-popover placement="left-start" title="选填" width="200" trigger="hover" content="添加首播/上映日期">
          <el-button slot="reference" @click="addReleaseDate()">新增{{ typeMedium | releaseCall }}</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="网络播放">
        <el-popover placement="left-start" title="选填" width="200" trigger="hover" content="选择拥有网络播放版权的网站，可多选，若选项不够请联系我们添加。">
          <el-select slot="reference" v-model="copyrights" multiple filterable default-first-option placeholder="请选择">
            <el-option v-for="website in videoWebsites" :key="website.value" :label="website.label" :value="website.value">
            </el-option>
          </el-select>
        </el-popover>
      </el-form-item>
      <el-form-item label="官网链接">
        <el-popover placement="left-start" title="选填" width="200" trigger="hover"
          :content="`长度上限为${officialUrlMaxLength}字符。可以不用填http://头或https://头，填了也没关系，会自动删掉。`">
          <el-input slot="reference" v-model="officialUrl" :maxlength="officialUrlMaxLength" show-word-limit></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="简介">
        <el-popover placement="left-start" title="选填" width="200" trigger="hover" :content="`可填写相关资讯或剧情介绍等，${introMaxLength}字符以内。`">
          <el-input slot="reference" type="textarea" :autosize="{minRows: 5}" v-model="intro" :maxlength="introMaxLength" show-word-limit></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <h1 class="title">制作 Staff</h1>
      </el-form-item>
      <el-form-item>
        <EditItemStaff></EditItemStaff>
      </el-form-item>
      <el-form-item>
        <h1 class="title">阵容 Cast</h1>
      </el-form-item>
      <el-form-item prop="cast">
        <EditItemCast></EditItemCast>
      </el-form-item>
      <el-form-item v-if="entryId" label="修改原因">
        <el-input
          type="textarea"
          :autosize="{minRows: 5}"
          placeholder="请填写修改条目原因"
          v-model="submitterMessage"
          :maxlength="submitterMessageMaxLength"
          show-word-limit></el-input>
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
  import { Form, FormItem, Popover, Input, Button, RadioGroup, Radio, Select, Option, Loading, Backtop, Icon } from 'element-ui'
  import EditItemCover from './public/EditItemCover'
  import EditItemOtherName from './public/EditItemOtherName'
  import EditItemButtonGroup from './public/EditItemButtonGroup'
  import EditItemReleaseDate from './private/EditItemReleaseDate'
  import EditItemStaff from './private/EditItemStaff'
  import EditItemCast from './private/EditItemCast'
  import moduleEditAnime from '@/store/modules/edit/editAnime'
  import { setPreview } from '@/util/preview'
  
  export default {
    name: 'EditAnime',
    
    metaInfo: {
      title: '编辑动画条目'
    },
    
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-popover': Popover,
      'el-input': Input,
      'el-button': Button,
      'el-radio-group': RadioGroup,
      'el-radio': Radio,
      'el-select': Select,
      'el-option': Option,
      'el-backtop': Backtop,
      'el-icon': Icon,
      EditItemCover,
      EditItemOtherName,
      EditItemButtonGroup,
      EditItemReleaseDate,
      EditItemStaff,
      EditItemCast
    },
    
    asyncData ({ store, route }) {
      if (!store.hasModule('editAnime')) store.registerModule('editAnime', moduleEditAnime)
      return store.state.activeRecordIdForEdit
        ? store.dispatch('editAnime/FETCH_LOCAL_RECORD', { id: store.state.activeRecordIdForEdit })
        : store.dispatch('editAnime/FETCH_DRAFT').catch(err => err)
    },
    
    beforeMount () {
      if (!this.$store.hasModule('editAnime')) {
        this.$store.registerModule('editAnime', moduleEditAnime)
        // 客户端渲染下无需执行FETCH_LOCAL_RECORD
        this.$store.dispatch('editAnime/FETCH_DRAFT').catch(err => err)
      }
    },
    
    // 重要信息：当多次访问路由时，
    // 避免在客户端重复注册模块。
    destroyed () {
      if (this.$store.hasModule('editAnime')) this.$store.unregisterModule('editAnime')
    },
    
    computed: {
      chineseNameMaxLength () {
        return this.$store.state.business.chineseNameMaxLength
      },
      foreignNameMaxLength () {
        return this.$store.state.business.foreignNameMaxLength
      },
      otherNamesMaxLength () {
        return this.$store.state.business.otherNamesMaxLength
      },
      otherNameMaxLength () {
        return this.$store.state.business.otherNameMaxLength
      },
      businessTypeMediums () {
        return this.$store.state.business.typeMediums
      },
      businessTypeSources () {
        return this.$store.state.business.typeSources
      },
      businessTypeGenres () {
        return this.$store.state.business.typeGenres
      },
      businessRegions () {
        return this.$store.state.business.regions
      },
      videoWebsites () {
        return this.$store.state.business.videoWebsites
      },
      officialUrlMaxLength () {
        return this.$store.state.business.officialUrlMaxLength
      },
      introMaxLength () {
        return this.$store.state.business.introMaxLength
      },
      submitterMessageMaxLength () {
        return this.$store.state.business.submitterMessageMaxLength
      },
      entryId () {
        return this.$store.state.editAnime.entryId
      },
      chineseName: {
        get () {
          return this.$store.state.editAnime.chineseName
        },
        set (value) {
          this.$store.commit('editAnime/SET_CHINESE_NAME', { value })
        }
      },
      foreignName: {
        get () {
          return this.$store.state.editAnime.foreignName
        },
        set (value) {
          this.$store.commit('editAnime/SET_FOREIGN_NAME', { value })
        }
      },
      otherNames () {
        return this.$store.state.editAnime.otherNames
      },
      typeMedium: {
        get () {
          return this.$store.state.editAnime.typeMedium
        },
        set (value) {
          this.$store.commit('editAnime/SET_TYPE_MEDIUM', { value })
        }
      },
      typeSource: {
        get () {
          return this.$store.state.editAnime.typeSource
        },
        set (value) {
          this.$store.commit('editAnime/SET_TYPE_SOURCE', { value })
        }
      },
      typeGenres: {
        get () {
          return this.$store.state.editAnime.typeGenres
        },
        set (value) {
          this.$store.commit('editAnime/SET_TYPE_GENRES', { value })
        }
      },
      regions: {
        get () {
          return this.$store.state.editAnime.regions
        },
        set (value) {
          this.$store.commit('editAnime/SET_REGIONS', { value })
        }
      },
      releaseDates () {
        return this.$store.state.editAnime.releaseDates
      },
      copyrights: {
        get () {
          return this.$store.state.editAnime.copyrights
        },
        set (value) {
          this.$store.commit('editAnime/SET_COPYRIGHTS', { value })
        }
      },
      officialUrl: {
        get () {
          return this.$store.state.editAnime.officialUrl
        },
        set (value) {
          this.$store.commit('editAnime/SET_OFFICIAL_URL', { value })
        }
      },
      intro: {
        get () {
          return this.$store.state.editAnime.intro
        },
        set (value) {
          this.$store.commit('editAnime/SET_INTRO', { value })
        }
      },
      submitterMessage: {
        get () {
          return this.$store.state.editAnime.submitterMessage
        },
        set (value) {
          this.$store.commit('editAnime/SET_SUBMITTER_MESSAGE', { value })
        }
      }
    },
    
    methods: {
      // 添加别名
      addOtherName () {
        this.$store.commit('editAnime/ADD_OTHER_NAME')
      },
      
      // 添加首播/上映日期
      addReleaseDate () {
        this.$store.commit('editAnime/ADD_RELEASE_DATE')
      },
      
      // 提交条目
      async submit () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('editAnime/SUBMIT')
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
          await this.$store.dispatch('editAnime/SAVE')
          this.$message.success('保存成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      // 预览
      preview () {
        // 格式化预览数据
        let entry = Object.assign({}, this.$store.state.editAnime, { coverUrl: this.$store.state.editAnime.cover.coverUrl })
        setPreview(JSON.stringify(entry))
        window.open('/preview/animes', '_blank')
      },
      
      // 删除草稿
      async remove () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('editAnime/DELETE')
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