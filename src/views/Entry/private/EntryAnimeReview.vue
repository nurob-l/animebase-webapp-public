<template>
  <div>
    <div v-if="savedReview.createdAt" class="review-panel">
      我{{ savedReview.status | reviewStatusLabel }}这部动画 {{ savedReview.createdAt | dateTimeString }}
      <el-button type="text" @click="dialogVisible = true">修改</el-button>
      <el-button type="text" @click="deleteReview()">删除</el-button>
      <div v-if="savedScoreAvg" class="user-vote">
        <div class="user-vote-title">我的评价：</div>
        <div class="user-vote-body">
          <div class="user-vote-score-avg">
            <el-rate :value="scoreAvg" disabled text-color="#ff9900" :colors="colors" disabled-void-color="#C0C4CC"></el-rate>
            <span>{{ scoreAvg.toFixed(1) }}</span>
            <img v-if="savedReview.recommend === valueOfRecommendYes" class="user-vote-recommend-icon" src="@/assets/images/like.svg" />
            <img v-else  class="user-vote-recommend-icon" src="@/assets/images/dislike.svg" />
            <span>{{ savedReview.recommend | recommendStatusLabel }}</span>
          </div>
          <div>
            剧情 {{ savedReview.scoreStory }} |
            角色 {{ savedReview.scoreCharacter }} |
            作画 {{ savedReview.scoreMake }} |
            演出 {{ savedReview.scoreShow }} |
            音乐 {{ savedReview.scoreMusic }}
          </div>
        </div>
      </div>
      <div>{{ savedReview.content }}</div>
    </div>
    <el-button v-else size="mini" plain round @click="openDialog()">写个短评</el-button>
    <el-dialog
      title="我来评评理"
      :visible.sync="dialogVisible"
      width="28rem"
      center
      :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-radio-group v-model="review.status" size="mini">
        <el-radio-button v-for="status in reviewStatus" :key="status.value" :label="status.value">{{ status.label }}</el-radio-button>
      </el-radio-group>
      <div v-if="review.status !== valueOfWantToWatch">
        <el-divider></el-divider>
        <div class="score-notice">给个评分吧！（整体选填）</div>
        <div v-if="scoreAvg" class="score-avg">
          <strong>综合分</strong>
          <el-rate :value="scoreAvg" disabled class="rate"></el-rate>
          <strong class="score-text">{{ scoreAvg.toFixed(1) }}</strong>
        </div>
        <div>
          <strong>剧情</strong>
          <!-- <el-rate v-model="review.scoreStory" @change="changeAvg()" show-text class="rate"></el-rate> -->
          <el-rate v-model="review.scoreStory" show-text class="rate"></el-rate>
        </div>
        <div>
          <strong>角色</strong>
          <!-- <el-rate v-model="review.scoreCharacter" @change="changeAvg()" show-text class="rate"></el-rate> -->
          <el-rate v-model="review.scoreCharacter" show-text class="rate"></el-rate>
        </div>
        <div>
          <strong>作画</strong>
          <!-- <el-rate v-model="review.scoreMake" @change="changeAvg()" show-text class="rate"></el-rate> -->
          <el-rate v-model="review.scoreMake" show-text class="rate"></el-rate>
        </div>
        <div>
          <strong>演出</strong>
          <!-- <el-rate v-model="review.scoreShow" @change="changeAvg()" show-text class="rate"></el-rate> -->
          <el-rate v-model="review.scoreShow" show-text class="rate"></el-rate>
        </div>
        <div>
          <strong>音乐</strong>
          <!-- <el-rate v-model="review.scoreMusic" @change="changeAvg()" show-text class="rate"></el-rate> -->
          <el-rate v-model="review.scoreMusic" show-text class="rate"></el-rate>
        </div>
        <div class="recommend">
          <span>您推荐这部动画吗？</span>
          <el-radio-group v-model="review.recommend" size="mini">
            <el-radio-button v-for="status in recommendStatus" :key="status.value" :label="status.value">{{ status.label }}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <el-divider></el-divider>
      <span>自选角度，文体不限，不多于{{ reviewContentMaxLength }}字</span>
      <el-input
        type="textarea"
        :rows="5"
        v-model="review.content"
        :maxlength="reviewContentMaxLength"
        show-word-limit>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveReview()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { Button, Dialog, RadioGroup, RadioButton, Divider, Rate, Input, Loading } from 'element-ui'
  import moduleReview from '@/store/modules/review'
  import { getScoreAvg, compareDate } from '@/util/business'

  export default {
    name: 'EntryAnimeReview',

    components: {
      'el-button': Button,
      'el-dialog': Dialog,
      'el-radio-group': RadioGroup,
      'el-radio-button': RadioButton,
      'el-divider': Divider,
      'el-rate': Rate,
      'el-input': Input
    },
    
    props: {
      id: {
        type: String,
        validator: value => parseInt(value) > 0
      }
    },
    
    data() {
      return {
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        dialogVisible: false,
        // 短评数据涉及用户身份认证，因此不使用服务端渲染
        // 因此数据放在组件内，不能放在vuex中，在客户端再获取数据
        // 否则服务端渲染时会导致获取不了数据而报错
        review: {
          entryId: null,
          status: null,
          content: '',
          scoreStory: null,
          scoreCharacter: null,
          scoreMake: null,
          scoreShow: null,
          scoreMusic: null,
          recommend: null,
          createdAt: null
        },
        savedReview: {}
      }
    },
    
    computed: {
      userId () {
        return this.$store.state.user.userId
      },
      earliestYear () {
        return this.$store.state.score.animes[this.id].earliestYear
      },
      earliestMonth () {
        return this.$store.state.score.animes[this.id].earliestMonth
      },
      earliestDay () {
        return this.$store.state.score.animes[this.id].earliestDay
      },
      // 只有动画开始放送/上映的当天以及之后才能进行评分
      isScoreOpen () {
        const now = new Date()
        return !compareDate({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate()
        }, {
          year: this.earliestYear,
          month: this.earliestMonth,
          day: this.earliestDay
        })
      },
      scoreAvg () {
        return getScoreAvg(this.review)
      },
      savedScoreAvg () {
        return getScoreAvg(this.savedReview)
      },
      reviewStatus () {
        return this.isScoreOpen
          ? this.$store.state.business.reviewStatus
          : this.$store.state.business.reviewStatusBeforeRelease
      },
      valueOfWantToWatch () {
        return this.$store.getters['business/valueOfWantToWatch']
      },
      valueOfHaveWatched () {
        return this.$store.getters['business/valueOfHaveWatched']
      },
      valueOfRecommendYes () {
        return this.$store.getters['business/valueOfRecommendYes']
      },
      recommendStatus () {
        return this.$store.state.business.recommendStatus
      },
      reviewContentMaxLength () {
        return this.$store.state.business.reviewContentMaxLength
      },
      // status: {
      //   get () {
      //     return this.$store.state.review.status
      //   },
      //   set (value) {
      //     this.$store.commit('review/SET_STATUS', { value })
      //   }
      // },
      // scoreStory: {
      //   get () {
      //     return this.$store.state.review.scoreStory
      //   },
      //   set (value) {
      //     this.$store.dispatch('review/SET_SCORE_STORY', { value })
      //   }
      // },
      // scoreCharacter: {
      //   get () {
      //     return this.$store.state.review.scoreCharacter
      //   },
      //   set (value) {
      //     this.$store.dispatch('review/SET_SCORE_CHARACTER', { value })
      //   }
      // },
      // scoreMake: {
      //   get () {
      //     return this.$store.state.review.scoreMake
      //   },
      //   set (value) {
      //     this.$store.dispatch('review/SET_SCORE_MAKE', { value })
      //   }
      // },
      // scoreShow: {
      //   get () {
      //     return this.$store.state.review.scoreShow
      //   },
      //   set (value) {
      //     this.$store.dispatch('review/SET_SCORE_SHOW', { value })
      //   }
      // },
      // scoreMusic: {
      //   get () {
      //     return this.$store.state.review.scoreMusic
      //   },
      //   set (value) {
      //     this.$store.dispatch('review/SET_SCORE_MUSIC', { value })
      //   }
      // },
      // recommend: {
      //   get () {
      //     return this.$store.state.review.recommend
      //   },
      //   set (value) {
      //     this.$store.commit('review/SET_RECOMMEND', { value })
      //   }
      // },
      // content: {
      //   get () {
      //     return this.$store.state.review.content
      //   },
      //   set (value) {
      //     this.$store.commit('review/SET_CONTENT', { value })
      //   }
      // },
      // createdAt () {
      //   return this.$store.state.review.createdAt
      // }
    },
    
    beforeMount () {
      this.$store.registerModule('review', moduleReview) // 注册是为了使用action
      this.init()
    },

    destroyed () {
      this.$store.unregisterModule('review')
    },
    
    methods: {
      // 初始化
      init () {
        this.review.entryId = this.id
        this.review.status = this.isScoreOpen ? this.valueOfHaveWatched : this.valueOfWantToWatch
        this.review.content = ''
        this.review.scoreStory = null
        this.review.scoreCharacter = null
        this.review.scoreMake = null
        this.review.scoreShow = null
        this.review.scoreMusic = null
        this.review.recommend = null
        this.review.createdAt = null
        // 尝试获取影评
        this.$store.dispatch('review/FETCH_ANIME_REVIEW', { entryId: this.id })
          .then(review => {
            this.review = Object.assign(this.review, review)
            // 仅用于展示的评论数据
            this.savedReview = Object.assign({}, this.review)
          })
          .catch(err => err)
      },
      
      openDialog () {
        // 先判断用户是否已登录
        if (this.userId) {
          this.dialogVisible = true
        } else {
          this.$message.error('亲，需要登录才能评论哦~')
          this.$router.push({
            path: '/sign',
            query: { redirect: this.$route.fullPath }
          })
        }
      },
      
      // changeAvg() {
      //   if ( !this.review.scoreStory
      //     || !this.review.scoreCharacter
      //     || !this.review.scoreMake
      //     || !this.review.scoreShow
      //     || !this.review.scoreMusic ) return
      //   let scoreAvg = this.$store.getters['review/scoreAvg'](this.review)
      //   this.review.scoreAvg = parseFloat(scoreAvg.toFixed(1)) // 保留一位小数点
      // },
      
      // 保存影评
      async saveReview() {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('review/SAVE_ANIME_REVIEW', { review: this.review })
          // 初始化评论。保存影评后，有可能数据已经变动（例如分数清空），所以需要更新
          this.init()
          this.$message.success('保存成功')
          this.dialogVisible = false
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      // 删除影评
      async deleteReview() {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('review/DELETE_ANIME_REVIEW', { entryId: this.id })
          this.init()
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      }
    }
  }
</script>

<style lang="sass" scoped>
  // 短评操作栏
  .review-panel
    font-size: 13px
    .user-vote
      display: flex
      .user-vote-body
        .user-vote-recommend-icon
          width: 1rem
          margin-left: auto
        .user-vote-score-avg
          display: flex
  // 评分模块公告
  .score-notice
    margin-bottom: 20px
  // 综合分模块
  .score-avg
    margin-bottom: 10px
    .score-text
      font-size: 32px
  // 通用评分模块样式
  .rate
    display: inline
  // 是否推荐选项模块
  .recommend
    margin-top: 20px
</style>
