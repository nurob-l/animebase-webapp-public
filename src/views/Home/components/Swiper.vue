<template>
<div>
    <!-- v-slide-group组件只有处在手机尺寸才能隐藏箭头，为了隐藏箭头只能将mobile-breakpoints设置的很大 -->
    <v-slide-group
      mobile-breakpoint="99999"
      ref="slideGroup"
    >
      <v-slide-item
        v-for="anime in animeList"
        :key="anime.entryId"
      >
        <v-card
          class="ma-2"
          :width="cardWidth"
          color="grey lighten-2"
          :href="'/entry/animes/' + anime.entryId"
          target="_blank"
          @mousewheel.prevent.native="mouseWheel"
        >
          <v-img
            :src="anime.entryId | animeCoverUrl"
            :aspect-ratio="45/64"
            class="align-end"
            eager
          >
            <v-row align="end" class="lightbox white--text pa-2">
              <v-col class="pb-0">
                <div class="text-caption">{{ {
                  year: anime.year,
                  month: anime.month,
                  day: anime.day
                } | dateStirng }}</div>
                <div class="text-subtitle-2 text-truncate">{{ anime.chineseName ? anime.chineseName : anime.foreignName }}</div>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
      </v-slide-item>
    </v-slide-group>
</div>
</template>

<script>
  import {
    VSlideGroup, VSlideItem, VImg
  } from 'vuetify/lib'

  export default {
    name: 'Swiper',
    
    components: {
      VSlideGroup, VSlideItem, VImg
    },
    
    props: {
      animeType: {
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
    
    computed: {
      // 从 store 的 state 对象中的获取 item。
      animeList () {
        return this.$store.state.animeList[this.animeType]
      },
      
      cardWidth () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '120px'
          case 'sm': return '140px'
          case 'md': return '160px'
          case 'lg': return '180px'
          case 'xl': return '200px'
        }
      },
      
      breakpoint () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '120px'
          case 'sm': return '140px'
          case 'md': return '160px'
          case 'lg': return '180px'
          case 'xl': return '200px'
        }
      }
    },
    
    methods: {
      next () {
        // 调用v-slide-group组件的内置方法
        this.$refs.slideGroup.onAffixClick('next')
      },
      
      prev () {
        // 调用v-slide-group组件的内置方法
        this.$refs.slideGroup.onAffixClick('prev')
      },
      
      // 令v-slide-group组件支持滚动
      mouseWheel (e) {
        e.deltaY > 0 ? this.next() : this.prev()
      }
    }
  }
</script>

<style>
  .lightbox {
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
  }
</style>
