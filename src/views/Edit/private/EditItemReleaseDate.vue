<template>
  <div>
    <el-col :span="4">
      <el-date-picker v-model="year" type="year" value-format="yyyy" placeholder="选择年" style="width: 100%;">
      </el-date-picker>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="4">
      <el-select v-model="month" :disabled="isMonthDisabled" filterable placeholder="选择月/季度">
        <el-option v-for="m in months" :key="m.value" :label="m.label" :value="m.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="4">
      <el-select v-model="day" :disabled="isDayDisabled" filterable placeholder="选择日">
        <el-option v-for="d in days" :key="d.value" :label="d.label" :value="d.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col class="line" :span="1">-</el-col>
    <el-col :span="4">
      <el-popover placement="top-end" title="选填" width="200" trigger="hover" :content="`填写地方/地区/范围，可不填，${releaseRegionMaxLength}字符以内`">
        <el-input slot="reference" v-model="region" :disabled="isRegionDisabled" placeholder="地区"
          :maxlength="releaseRegionMaxLength" show-word-limit></el-input>
      </el-popover>
    </el-col>
    <el-col :span="4">
      <el-button type="danger" size="medium" @click.prevent="removeDate" class="remove-date-button">删除</el-button>
    </el-col>
  </div>
</template>

<script>
  import { Col, DatePicker, Select, Option, Input, Popover, Button } from 'element-ui'
  
  export default {
    name: 'EditItemReleaseDate',
    
    components: {
      'el-col': Col,
      'el-date-picker': DatePicker,
      'el-select': Select,
      'el-option': Option,
      'el-input': Input,
      'el-popover': Popover,
      'el-button': Button
    },
    
    props: {
      id: {
        type: String,
        required: true
      }
    },
    
    computed: {
      months () {
        return this.$store.state.business.months
      },
      days () {
        return this.$store.state.business.days
      },
      releaseRegionMaxLength () {
        return this.$store.state.business.releaseRegionMaxLength
      },
      year: {
        get () {
          return this.$store.state.editAnime.releaseDates[this.id].year
        },
        set (value) {
          this.$store.dispatch('editAnime/SET_RELEASE_DATE', { id: this.id, prop: 'year', value })
        }
      },
      month: {
        get () {
          return this.$store.state.editAnime.releaseDates[this.id].month
        },
        set (value) {
          this.$store.dispatch('editAnime/SET_RELEASE_DATE', { id: this.id, prop: 'month', value })
        }
      },
      day: {
        get () {
          return this.$store.state.editAnime.releaseDates[this.id].day
        },
        set (value) {
          this.$store.dispatch('editAnime/SET_RELEASE_DATE', { id: this.id, prop: 'day', value })
        }
      },
      region: {
        get () {
          return this.$store.state.editAnime.releaseDates[this.id].region
        },
        set (value) {
          this.$store.dispatch('editAnime/SET_RELEASE_DATE', { id: this.id, prop: 'region', value })
        }
      },
      isMonthDisabled () {
        return this.$store.getters['business/isMonthDisabled'](this.year)
      },
      isDayDisabled () {
        return this.$store.getters['business/isDayDisabled'](this.month)
      },
      isRegionDisabled () {
        return this.$store.getters['business/isRegionDisabled'](this.year)
      }
    },
    
    methods: {
      // 删除首播/上映日期
      removeDate () {
        this.$store.commit('editAnime/DELETE_RELEASE_DATE', { id: this.id })
      }
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }
  
  .remove-date-button {
    margin-left: 20%;
  }
</style>
