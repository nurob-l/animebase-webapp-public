<template>
  <el-main class="view">
    <el-container>
      <h2 v-if="chineseName" class="main-title">{{ chineseName }} <small v-if="foreignName" class="text-muted">{{ foreignName }}</small></h2>
      <h2 v-else class="main-title">{{ foreignName }}</h2>
    </el-container>
    <el-row>
      <el-col class="entry-main-info">
        <el-row class="media">
          <img v-if="coverUrl" class="cover" :src="coverUrl" :alt="`${chineseName ? chineseName : foreignName}的封面`" />
          <div v-else class="no-cover">暂无封面</div>
          <div class="media-body">
            <p v-if="Object.keys(otherNames).length">别名：<span v-for="(value, id, index) in otherNames">{{ (index ? ' / ' : '') + value }}</span></p>
            <p>媒介：{{ typeMedium | mediumLabel }}</p>
            <p>来源：{{ typeSource | sourceLabel }}</p>
            <p v-if="typeGenres.length">题材：<span v-for="(value, index) in typeGenres">{{ index ? ' / ' : '' }}{{ value | genreLabel }}</span></p>
            <p v-if="regions.length">制片：<span v-for="(value, index) in regions">{{ index ? ' / ' : '' }}{{ value | regionLabel }}</span></p>
            <p v-if="Object.keys(releaseDates).length">{{ typeMedium | releaseCall }}：<span v-for="(releaseDate, id, index) in releaseDates">{{ index ? ' / ' : '' }}{{ releaseDate | dateStirng }}</span></p>
            <p v-if="copyrights.length">版权：<span v-for="(value, index) in copyrights">{{ index ? ' / ' : '' }}{{ value | copyrightLabel }}</span></p>
            <p v-if="officialUrl">官网：<a :href="`http://${officialUrl}`" target="_blank" rel="noopener norefferrer" class="official-url">{{ officialUrl }}</a></p>
          </div>
        </el-row>
        <el-row>
          <h2 class="title">简介</h2>
          <pre class="intro">{{ intro }}</pre>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="entry-swiper">
      <h2 class="title">STAFF</h2>
      <EntryAnimeSwiperStaff :items="staffs"></EntryAnimeSwiperStaff>
    </el-row>
    <el-row class="entry-swiper">
      <h2 class="title">CAST</h2>
      <EntryAnimeSwiperCast :items="casts"></EntryAnimeSwiperCast>
    </el-row>
  </el-main>
</template>

<script>
  import { Col, Link } from 'element-ui'
  import EntryAnimeSwiperStaff from './private/EntryAnimeSwiperStaff'
  import EntryAnimeSwiperCast from './private/EntryAnimeSwiperCast'
  import { getPreview } from '@/util/preview'

  export default {
    name: 'PreviewAnime',

    metaInfo: {
      title: '动画条目预览'
    },
    
    components: {
      'el-col': Col,
      'el-link': Link,
      EntryAnimeSwiperStaff,
      EntryAnimeSwiperCast
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
      typeMedium () {
        return this.entry.typeMedium
      },
      typeSource () {
        return this.entry.typeSource
      },
      typeGenres () {
        return this.entry.typeGenres || []
      },
      regions () {
        return this.entry.regions || []
      },
      releaseDates () {
        return this.entry.releaseDates || {}
      },
      copyrights () {
        return this.entry.copyrights || []
      },
      officialUrl () {
        return this.entry.officialUrl
      },
      intro () {
        return this.entry.intro
      },
      staffs () {
        return this.entry.staffs
      },
      casts () {
        return this.entry.casts
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  @import "@/assets/css/entry"
</style>
