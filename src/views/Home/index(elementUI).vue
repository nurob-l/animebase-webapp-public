<template>
  <el-main class="view">
    <el-container>
      <h1 class="main-title">本季动画 ({{ currentYear }}年{{ getSeasonMonth(currentMonth) }}月新番)</h1>
      <!-- <a class="see-more" :href="`/animes/${currentYear}/${getSeasonMonth(currentMonth)}`" target="_blank">查看全部 ({{ countOfCurrent }}部)</a> -->
      <a class="see-more" href="/animes/current" target="_blank">查看全部 ({{ countOfCurrent }}部)</a>
    </el-container>
    <el-row>
      <Swiper type="current"></Swiper>
    </el-row>
    <el-container>
      <h1 class="main-title">即将开播/上映 ({{ nextYear }}年{{ getSeasonMonth(nextMonth) }}月新番、时间未知)</h1>
      <a class="see-more" href="/animes/upcoming" target="_blank">查看全部 ({{ countOfUpcoming }}部)</a>
    </el-container>
    <el-row>
      <Swiper type="upcoming"></Swiper>
    </el-row>
  </el-main>
</template>

<script>
  import Swiper from './components/Swiper';

  export default {
    name: 'Home',
    
    metaInfo: {
      title: 'Tuile',
      // override the parent template and just use the above title only
      titleTemplate: null
    },
    
    components: {
      Swiper
    },
    
    asyncData ({ store }) {
      // 触发 action 后，会返回 Promise
      return Promise.all([
        store.dispatch('FETCH_ANIME_LIST', { type: 'current' }),
        store.dispatch('FETCH_ANIME_LIST', { type: 'upcoming' })
      ])
    },
    
    computed: {
      now () {
        return new Date()
      },
      
      currentYear () {
        return this.now.getFullYear()
      },
      
      currentMonth () {
        return this.now.getMonth() + 1
      },
      
      nextYear () {
        return this.currentYear + parseInt((this.currentMonth + 3) / 12)
      },
      
      nextMonth () {
        return (this.currentMonth + 3) % 12
      },
      
      countOfCurrent () {
        return this.$store.state.animeList['current'].length
      },
      
      countOfUpcoming () {
        return this.$store.state.animeList['upcoming'].length
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

<style lang="sass">
  @import "@/assets/css/main"
</style>