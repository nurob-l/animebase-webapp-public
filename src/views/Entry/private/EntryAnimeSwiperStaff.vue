<template>
  <div v-swiper="swiperOption">
    <div class="swiper-wrapper swiper-box">
      <div class="swiper-slide swiper-box-item" v-for="item in items">
        <a v-if="item.personId" :href="'/entry/persons/' + item.personId" target="_blank">
          <img :src="item.personId | personCoverUrl" class="entry-swiper-image" />
        </a>
        <div class="entry-swiper-text" :title="item.personName">{{ item.personName }}</div>
        <div class="entry-swiper-text text-muted" :title="item.positionName">{{ item.positionName }}</div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
  import { directive } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  export default {
    name: 'EntryAnimeSwiperStaff',

    directives: {
      swiper: directive
    },
      
    props: {
      items: {
        type: Array
      }
    },

    data() {
      return {
        swiperOption: {
          slidesPerView: 7,
          slidesPerColumn: 1,
          spaceBetween: 50,
          slidesPerGroup: 4,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            hideOnClick: true
          },
          mousewheel: true
        }
      }
    }
  }
</script>

<style>
</style>
