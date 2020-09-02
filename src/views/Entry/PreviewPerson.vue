<template>
  <el-main class="view">
    <el-container>
      <h1 v-if="chineseName" class="main-title">{{ chineseName }} <small v-if="foreignName" class="text-muted">{{ foreignName }}</small></h1>
      <h1 v-else class="main-title">{{ foreignName }}</h1>
    </el-container>
    <el-row>
      <el-col class="entry-main-info">
        <el-row class="media">
          <img v-if="coverUrl" class="cover" :src="coverUrl" :alt="`${chineseName ? chineseName : foreignName}的封面`" />
          <div v-else class="no-cover">暂无封面</div>
          <div class="media-body">
            <p v-if="Object.keys(otherNames).length">别名：<span v-for="(value, id, index) in otherNames">{{ (index ? ' / ' : '') + value }}</span></p>
            <p>{{ typePerson | birthdayCall }}：{{ birthday }}</p>
            <p>{{ typePerson | birthplaceCall }}：{{ birthplace }}</p>
          </div>
        </el-row>
        <el-row>
          <h2 class="title">简介</h2>
          <pre class="intro">{{ intro }}</pre>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-if="typePerson !== valueOfPersonHuman" class="entry-swiper">
      <h2 class="title">成员</h2>
      <EntryPersonSwiperMember :items="members"></EntryPersonSwiperMember>
    </el-row>
  </el-main>
</template>

<script>
  import { Col, Link } from 'element-ui'
  import EntryPersonSwiperMember from './private/EntryPersonSwiperMember'
  import { getPreview } from '@/util/preview'

  export default {
    name: 'PreviewPerson',
    
    metaInfo: {
      title: '人物条目预览'
    },
    
    components: {
      'el-col': Col,
      'el-link': Link,
      EntryPersonSwiperMember
    },
    
    data() {
      return {
        entry: {}
      }
    },
    
    beforeMount () {
      const entryData = getPreview()
      Object.assign(this.entry, JSON.parse(entryData))
    },
    
    computed: {
      valueOfPersonHuman () {
        return this.$store.getters['business/valueOfPersonHuman']
      },
      chineseName () {
        return this.entry.chineseName
      },
      foreignName () {
        return this.entry.foreignName
      },
      coverUrl () {
        return this.entry.coverUrl
      },
      otherNames () {
        return this.entry.otherNames || {}
      },
      typePerson () {
        return this.entry.typePerson
      },
      birthday () {
        return this.entry.birthday
      },
      birthplace () {
        return this.entry.birthplace
      },
      intro () {
        return this.entry.intro
      },
      members () {
        return this.entry.members
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  @import "@/assets/css/entry"
</style>