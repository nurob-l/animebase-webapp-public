<template>
  <!-- Provides the application the proper gutter -->
  <v-container fluid>
    <v-row>
      <v-col
        :cols="cols"
        :offset="offset"
        class="d-flex justify-space-between align-center mx-auto"
      >
        <h1 v-if="chineseName" class="text-h4">{{ chineseName }} <small v-if="foreignName" class="text--secondary">{{ foreignName }}</small></h1>
        <h1 v-else class="text-h4">{{ foreignName }}</h1>
        <v-btn class="ma-2" text @click="handleEdit()">
          <v-icon left>mdi-pencil</v-icon> 完善信息
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        :cols="mainCols"
        :offset="offset"
      >
        <v-sheet class="d-flex">
          <v-card
            :width="225"
            :height="225 * 64 / 45"
            color="grey lighten-2 mr-4 mb-4"
          >
            <v-img
              :src="id | animeCoverUrl"
              :aspect-ratio="45/64"
            >
            </v-img>
          </v-card>
          <!-- <v-img
            :src="id | animeCoverUrl"
            :aspect-ratio="45/64"
            :width="225"
          >
          </v-img> -->
      
          <div class="text-body-1">
            <p v-if="Object.keys(otherNames).length">
              <span class="text--secondary">别名：</span><span v-for="(value, id, index) in otherNames">{{ (index ? ' / ' : '') + value }}</span>
            </p>
            <p>
              <span class="text--secondary">媒介：</span>{{ typeMedium | mediumLabel }}
            </p>
            <p>
              <span class="text--secondary">来源：</span>{{ typeSource | sourceLabel }}
            </p>
            <p v-if="typeGenres.length">
              <span class="text--secondary">题材：</span><span v-for="(value, index) in typeGenres">{{ index ? ' / ' : '' }}{{ value | genreLabel }}</span>
            </p>
            <p v-if="regions.length">
              <span class="text--secondary">制片：</span><span v-for="(value, index) in regions">{{ index ? ' / ' : '' }}{{ value | regionLabel }}</span>
            </p>
            <p v-if="Object.keys(releaseDates).length">
              <span class="text--secondary">{{ typeMedium | releaseCall }}：</span><span v-for="(releaseDate, id, index) in releaseDates">{{ index ? ' / ' : '' }}{{ releaseDate | dateStirng }}</span>
            </p>
            <p v-if="copyrights.length">
              <span class="text--secondary">版权：</span><span v-for="(value, index) in copyrights">{{ index ? ' / ' : '' }}{{ value | copyrightLabel }}</span>
            </p>
            <p v-if="officialUrl">
              <span class="text--secondary">官网：</span><v-btn text small :href="`http://${officialUrl}`" target="_blank" rel="noopener norefferrer" class="pa-0">{{ officialUrl }}</v-btn>
            </p>
          </div>
        </v-sheet>
        <div v-if="$vuetify.breakpoint.smAndUp">
          <h2 class="text-h6">简介</h2>
          <!-- <pre class="intro">{{ intro }}</pre> -->
          <div class="">{{ intro }}</div>
        </div>
      </v-col>
      <v-col
        :cols="asideCols"
      >
        <EntryAnimeScore :id="id"></EntryAnimeScore>
        <EntryAnimeReview :id="id"></EntryAnimeReview>
      </v-col>
      <v-col
        v-if="$vuetify.breakpoint.xsOnly"
        :cols="mainCols"
        :offset="offset"
      >
        <h2 class="title">简介</h2>
        <pre class="intro">{{ intro }}</pre>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
  import { Col, Link } from 'element-ui'
  import EntryAnimeSwiperStaff from './private/EntryAnimeSwiperStaff'
  import EntryAnimeSwiperCast from './private/EntryAnimeSwiperCast'
  import EntryAnimeScore from './private/EntryAnimeScore'
  import EntryAnimeReview from './private/EntryAnimeReview'
  import moduleEntryAnime from '@/store/modules/entry/entryAnime'
  import Vue from 'vue'
  import {
    VSheet, VCard, VImg
  } from 'vuetify/lib'

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
      EntryAnimeReview,
      VSheet,
      VCard,
      VImg
    },
    
    props: {
      id: {
        type: String,
        required: true,
        validator: value => parseInt(value) > 0
      },
      initCols: String,
      initOffset: String
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
      },
      cols () {
        return this.initCols
      },
      offset () {
        return this.initOffset
      },
      asideCols () {
        return Math.floor(this.cols / 3)
      },
      mainCols () {
        return this.cols - this.asideCols
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
