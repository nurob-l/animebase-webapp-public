<template>
  <div v-swiper="swiperOption" :instance-name="type">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="anime in animeList" :key="anime.entryId">
        <a class="card-outer" :href="'/entry/animes/' + anime.entryId" target="_blank" rel="noopener norefferrer">
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
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
  import { Image } from 'element-ui'
  import { directive } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  export default {
    name: 'Swiper',
    
    components: {
      'el-image': Image
    },
    
    directives: {
      swiper: directive
    },
  
    props: {
      type: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'current',
            'upcoming'
          ].indexOf(value) !== -1
        }
      }
    },
    
    data () {
      return {
        swiperOption: {
          slidesPerView: 5,
          slidesPerColumn: 1,
          spaceBetween: 25,
          slidesPerGroup: 3,
          // loop: true,
          // loopFillGroupWithBlank: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          mousewheel: true
        }
      }
    },
    
    computed: {
      // 从 store 的 state 对象中的获取 item。
      animeList () {
        return this.$store.state.animeList[this.type]
      }
    }
  }
</script>

<style lang="sass">
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
