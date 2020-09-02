<template>
  <div v-swiper="swiperOption">
    <div class="swiper-wrapper swiper-box">
      <div class="swiper-slide swiper-box-item" v-for="item in items">
        <a v-if="item.characterId" :href="'/entry/characters/' + item.characterId" target="_blank">
          <img :src="item.characterId | characterCoverUrl" class="entry-swiper-image" />
        </a>
        <img v-else-if="hasCharacterId" class="entry-swiper-placeholder" src="@/assets/images/cover-placeholder.webp" />
        <div class="entry-swiper-text" :title="item.characterName">{{ item.characterName }}</div>
        <a v-if="item.personId" :href="'/entry/persons/' + item.personId" target="_blank">
          <img :src="item.personId | personCoverUrl" class="entry-swiper-person-image" />
        </a>
        <img v-else-if="hasPersonId" class="entry-swiper-person-placeholder" src="@/assets/images/cover-placeholder.webp" />
        <div class="entry-swiper-text" :title="item.personName">{{ item.personName }}</div>
      </div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
  import { directive } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  export default {
    name: 'EntryAnimeSwiperCast',

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
    },
    
    computed: {
      hasCharacterId () {
        return this.items.some(item => item.characterId)
      },
      hasPersonId () {
        return this.items.some(item => item.personId)
      }
    }
  }
</script>

<style>
</style>
