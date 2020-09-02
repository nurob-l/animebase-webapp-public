<template>
  <div>
    <h2 class="title score-title">图一乐评分</h2>
    <div class="score-container">
      <strong v-if="numberScores" class="score-avg">{{ scoreAvg.toFixed(1) }}</strong>
      <div class="score-rate">
        <el-rate
          :value="scoreAvg"
          disabled
          size="big"
          text-color="#ff9900"
          :colors="colors"
          disabled-void-color="#C0C4CC"></el-rate>
        <div v-if="numberScores" class="score-content">{{ numberScores }}人评分 ({{ recommendRate | percent }}好评)</div>
        <div v-else class="score-content text-muted">{{ isScoreOpen ? '暂无评分' : '尚未放送/上映' }}</div>
      </div>
    </div>
    <div v-if="numberScores" id="scoresChart" :style="{width: '350px', height: '250px'}"></div>
  </div>
</template>

<script>
  import { Rate } from 'element-ui'
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 引入雷达图
  import 'echarts/lib/chart/radar'
  // 引入提示框组件
  import 'echarts/lib/component/tooltip'
  import { compareDate } from '@/util/business'
  
  export default {
    name: 'EntryAnimeRate',
    
    components: {
      'el-rate': Rate
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
        option: {
          tooltip: {
            trigger: 'axis'
          },
          radar: {
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 3]
              }
            },
            indicator: [
              {text: '剧情', max: 5},
              {text: '角色', max: 5},
              {text: '作画', max: 5},
              {text: '演出', max: 5},
              {text: '音乐', max: 5}
            ],
            radius: 80
          },
          series: [{
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {
              opacity: 0.2,
            },
            data: [{
              value: [],
              name: '',
              label: {
                show: true,
                formatter: params => params.value
              }
            }]
          }]
        }
      }
    },
    
    computed: {
      score () {
        return this.$store.state.score.animes[this.id]
      },
      numberScores () {
        return this.$store.state.score.animes[this.id].numberScores
      },
      numberRecommends () {
        return this.$store.state.score.animes[this.id].numberRecommends
      },
      recommendRate () {
        return this.numberRecommends / this.numberScores
      },
      scoreAvg () {
        return this.$store.state.score.animes[this.id].scoreAvg
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
      title () {
        return this.$store.getters.animeTitle(this.id)
      }
    },
    
    mounted () {
      if (!this.numberScores) return
      this.setChartScore()
      this.drawChart()
    },
    
    methods: {
      drawChart() {
        // 基于准备好的dom，初始化echarts实例
        let chart = echarts.init(document.getElementById('scoresChart'))
        // 绘制图表
        chart.setOption(this.option)
      },
      
      setChartScore() {
        this.option.series[0].data[0].name = this.title
        this.option.series[0].data[0].value.push(this.score.scoreStory.toFixed(1))
        this.option.series[0].data[0].value.push(this.score.scoreCharacter.toFixed(1))
        this.option.series[0].data[0].value.push(this.score.scoreMake.toFixed(1))
        this.option.series[0].data[0].value.push(this.score.scoreShow.toFixed(1))
        this.option.series[0].data[0].value.push(this.score.scoreMusic.toFixed(1))
      }
    }
  }
</script>

<style lang="sass" scoped>
  .score-title
    margin-block-start: 0
  .score-container
    display: flex
    justify-content: center
    .score-avg
      font-size: 32px
    .score-rate
      margin-left: 1rem
      .score-content
        font-size: 13px
</style>
