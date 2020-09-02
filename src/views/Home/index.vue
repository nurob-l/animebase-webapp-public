<template>
  <!-- Provides the application the proper gutter -->
  <v-container fluid>
    <v-row>
      <v-col
        :cols="cols"
        :offset="offset"
        class="d-flex justify-space-between align-center mx-auto"
      >
        <div>
          <h1 class="title">本季动画 ({{ currentYear }}年{{ currentSeasonMonth }}月新番)</h1>
        </div>
        <div v-if="$vuetify.breakpoint.smAndUp">
          <v-icon @click="$refs.currentAnimes.prev()">mdi-chevron-left</v-icon>
          <v-icon @click="$refs.currentAnimes.next()">mdi-chevron-right</v-icon>
        </div>
      </v-col>
      <v-col
        :cols="cols"
        :offset="offset"
      >
        <Swiper anime-type="current" ref="currentAnimes"></Swiper>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        :cols="cols"
        :offset="offset"
        class="d-flex justify-space-between align-center mx-auto"
      >
        <div>
          <h1 class="title">即将开播/上映 ({{ nextYear }}年{{ nextSeasonMonth }}月新番等)</h1>
        </div>
        <div v-if="$vuetify.breakpoint.smAndUp">
          <v-icon @click="$refs.upcomingAnimes.prev()">mdi-chevron-left</v-icon>
          <v-icon @click="$refs.upcomingAnimes.next()">mdi-chevron-right</v-icon>
        </div>
      </v-col>
      <v-col
        :cols="cols"
        :offset="offset"
      >
        <Swiper anime-type="upcoming" ref="upcomingAnimes"></Swiper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Swiper from './components/Swiper';
  
  export default {
    name: 'Home',
    
    components: {
      Swiper
    },
    
    props: {
      initCols: String,
      initOffset: String
    },
    
    metaInfo: {
      title: 'Tuile',
      // override the parent template and just use the above title only
      titleTemplate: null
    },
    
    asyncData ({ store }) {
      return Promise.all([
        store.dispatch('FETCH_ANIME_LIST', { type: 'current' }),
        store.dispatch('FETCH_ANIME_LIST', { type: 'upcoming' })
      ])
    },
    
    data: () => ({
      model: 0
    }),
    
    computed: {
      cols () {
        return this.initCols
      },
      
      offset () {
        return this.initOffset
      },
      
      now () {
        return new Date()
      },
      
      currentYear () {
        return this.now.getFullYear()
      },
      
      currentSeasonMonth () {
        return this.getSeasonMonth(this.now.getMonth() + 1)
      },
      
      nextYear () {
        return this.currentYear + parseInt((this.currentSeasonMonth + 3) / 12)
      },
      
      nextSeasonMonth () {
        return (this.currentSeasonMonth + 3) % 12
      }
    },
    
    methods: {
      getSeasonMonth (month) {
        switch(month) {
          // 冬季动画(1月新番)
          case 1: case 2: case 3:
            return 1
          // 春季动画(4月新番)
          case 4: case 5: case 6:
            return 4
          // 夏季动画(7月新番)
          case 7: case 8: case 9:
            return 7
          // 秋季动画(10月新番)
          case 10: case 11: case 12:
            return 10
        }
      }
    }
  }
</script>

<style>
</style>