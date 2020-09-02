<template>
  <el-main class="view">
    <el-menu class="" mode="horizontal" :default-active="this.$route.path" :router="true">
      <el-menu-item index="/animes/all">所有动画</el-menu-item>
      <el-menu-item index="/animes/upcoming">即将开播</el-menu-item>
      <el-menu-item index="/animes/current">当季动画</el-menu-item>
      <el-menu-item index="/animes/finished">已完结</el-menu-item>
    </el-menu>
    <h1>{{ title[type] }}</h1>
    <div class="box">
      <div class="box-item" v-for="anime in animeList" :key="anime.entryId">
        <a class="card-outer" :href="'/entry/animes/' + anime.entryId" target="_blank">
          <el-image :src="anime.entryId | animeCoverUrl" class="card-image" :alt="`${anime.chineseName ? anime.chineseName : anime.foreignName}的封面`">
          </el-image>
          <div class="card-content">
            <span>{{ anime.chineseName ? anime.chineseName : anime.foreignName }}</span>
            <time class="font-size-body-small">{{ {
              year: anime.year,
              month: anime.month,
              day: anime.day
            } | dateStirng }}</time>
          </div>
        </a>
      </div>
    </div>
  </el-main>
</template>

<script>
  import { Menu, MenuItem, Image } from 'element-ui'
  
  export default {
    name: 'Anime',
    
    components: {
      'el-menu': Menu,
      'el-menu-item': MenuItem,
      'el-image': Image
    },
    
    // metaInfo: {
    //   title: '新番动画列表'
    // },
    
    metaInfo () {
      return {
        title: this.title[this.type]
      }
    },
  
    props: {
      // year: {
      //   type: String,
      //   required: true,
      //   validator: value => {
      //     return value === 'upcoming' || parseInt(value) > 0
      //   }
      // },
      // month: {
      //   type: String
      // },
      type: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'all',
            'upcoming',
            'current',
            'finished'
          ].indexOf(value) !== -1
        }
      }
    },
    
    data () {
      return {
        title: {
          'all': '全部新番动画列表',
          'upcoming': '即将开播/上映新番动画列表',
          'current': `${new Date().getFullYear()}年${this.getSeasonMonth(new Date().getMonth() + 1)}月${this.getSeason(new Date().getMonth() + 1)}季新番动画列表`,
          'finished': '已完结新番动画列表'
        }
      }
    },
    
    asyncData ({ store, route: { params: { type }}}) {
      return store.dispatch('FETCH_ANIME_LIST', { type })
    },
    
    computed: {
      animeList () {
        return this.$store.state.animeList[this.type]
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
      },
      
      getSeason (month) {
        switch(month) {
          // 冬季动画(1月新番)
          case 1: case 2: case 3:
            return '冬'
          // 春季动画(4月新番)
          case 4: case 5: case 6:
            return '春'
          // 夏季动画(7月新番)
          case 7: case 8: case 9:
            return '夏'
          // 秋季动画(10月新番)
          case 10: case 11: case 12:
            return '秋'
        }
      }
    }
  }
</script>

<style lang="sass">
  .box
    display: grid
    grid-template-columns: repeat(5, 202.5px)
    grid-row-gap: 20px
    grid-column-gap: 27px
    .box-item
      .card-outer
        display: block
        width: 202.5px
        height: 288px
        background-color: white
        position: relative // 想让子元素在父元素底部，父元素需要设置position: relative
        .card-image
          border-radius: 6px
        .card-content
          display: flex
          flex-direction: column
          width: inherit
          box-sizing: border-box
          padding: 15px 5px 5px
          border-bottom-right-radius: 6px
          border-bottom-left-radius: 6px
          background-image: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))
          color: #ffffff
          position: absolute
          bottom: 0
</style>