<template>
  <el-main class="view">
    <el-container>
      <h1 v-if="chineseName" class="main-title">{{ chineseName }} <small v-if="foreignName" class="text-muted">{{ foreignName }}</small></h1>
      <h1 v-else class="main-title">{{ foreignName }}</h1>
      <el-link icon="el-icon-edit" :underline="false" class="entry-edit-button" @click="handleEdit()">让我来完善信息</el-link>
    </el-container>
    <el-row>
      <!-- 如果不手动设置span，el-col会自动默认设置span为24，导致在生产环境打包之后覆盖class中的样式导致样式崩坏 -->
      <el-col class="entry-main-info">
        <el-row class="media">
          <img v-if="coverUrl" class="cover" :src="id | animeCoverUrl" :alt="`${chineseName ? chineseName : foreignName}的封面`" />
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
      <el-col class="entry-aside-info">
        <EntryAnimeScore :id="id"></EntryAnimeScore>
        <EntryAnimeReview :id="id"></EntryAnimeReview>
      </el-col>
    </el-row>
    <el-row class="entry-swiper">
      <h2 class="title">STAFF<small class="see-more-disable"> 查看全部(绝赞开发中)</small></h2>
      <EntryAnimeSwiperStaff :items="staffs"></EntryAnimeSwiperStaff>
    </el-row>
    <el-row class="entry-swiper">
      <h2 class="title">CAST<small class="see-more-disable"> 查看全部(绝赞开发中)</small></h2>
      <EntryAnimeSwiperCast :items="casts"></EntryAnimeSwiperCast>
    </el-row>
    <el-row>
      <h2 class="title text-muted">短评(绝赞开发中)</h2>
    </el-row>
  </el-main>
</template>

<script>
  import { Col, Link } from 'element-ui'
  import EntryAnimeSwiperStaff from './private/EntryAnimeSwiperStaff'
  import EntryAnimeSwiperCast from './private/EntryAnimeSwiperCast'
  import EntryAnimeScore from './private/EntryAnimeScore'
  import EntryAnimeReview from './private/EntryAnimeReview'
  import moduleEntryAnime from '@/store/modules/entry/entryAnime'
  import Vue from 'vue'

  export default {
    name: 'EntryAnime',
    
    metaInfo () {
      return {
        title: `${this.chineseName ? this.chineseName : this.foreignName}`,
        meta: [{
          vmid: 'description',
          name: 'description',
          content: `${this.chineseName} ${this.foreignName}动画简介和剧情介绍、staff制作阵容、cast声优阵容、影评、影讯、论坛`,
        }]
      }
    },
      
    components: {
      'el-col': Col,
      'el-link': Link,
      EntryAnimeSwiperStaff,
      EntryAnimeSwiperCast,
      EntryAnimeScore,
      EntryAnimeReview
    },
    
    props: {
      id: {
        type: String,
        required: true,
        validator: value => parseInt(value) > 0
      }
    },
    
    asyncData ({ store, route: { params: { id }}}) {
      store.registerModule('entryAnime', moduleEntryAnime) // 注册是为了使用action
      return Promise.all([
        store.dispatch('entryAnime/FETCH_ENTRY', { id }),
        store.dispatch('entryAnime/FETCH_SCORE', { id })
      ])
    },
    
    destroyed () {
      if (this.$store.hasModule('entryAnime')) this.$store.unregisterModule('entryAnime')
    },
    
    computed: {
      recordId () {
        return this.$store.state.entry.animes[this.id].recordId
      },
      chineseName () {
        return this.$store.state.entry.animes[this.id].chineseName
      },
      foreignName () {
        return this.$store.state.entry.animes[this.id].foreignName
      },
      coverUrl () {
        return this.$store.state.entry.animes[this.id].coverUrl
      },
      otherNames () {
        return this.$store.state.entry.animes[this.id].otherNames
      },
      typeMedium () {
        return this.$store.state.entry.animes[this.id].typeMedium
      },
      typeSource () {
        return this.$store.state.entry.animes[this.id].typeSource
      },
      typeGenres () {
        return this.$store.state.entry.animes[this.id].typeGenres
      },
      regions () {
        return this.$store.state.entry.animes[this.id].regions
      },
      releaseDates () {
        return this.$store.state.entry.animes[this.id].releaseDates
      },
      copyrights () {
        return this.$store.state.entry.animes[this.id].copyrights
      },
      officialUrl () {
        return this.$store.state.entry.animes[this.id].officialUrl
      },
      intro () {
        return this.$store.state.entry.animes[this.id].intro
      },
      staffs () {
        return this.$store.state.entry.animes[this.id].staffs
      },
      casts () {
        return this.$store.state.entry.animes[this.id].casts
      }
    },
    
    methods: {
      handleEdit() {
        this.$store.commit('SET_ACTIVE_RECORD_ID_FOR_EDIT', { id: this.recordId })
        this.$store.commit('SET_ANIME_RECORD', { entry: this.$store.state.entry.animes[this.id] })
        this.$router.push('/edit/animes')
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  @import "@/assets/css/entry"
</style>
