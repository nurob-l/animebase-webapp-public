<template>
  <el-input v-model="otherName" :maxlength="otherNameMaxLength" show-word-limit>
    <el-button slot="append" @click.prevent="removeOtherName">删除</el-button>
  </el-input>
</template>

<script>
  import { Input, Button } from 'element-ui'
  
  export default {
    name: 'EditItemOtherName',
    
    components: {
      'el-input': Input,
      'el-button': Button
    },
    
    props: {
      id: {
        type: String,
        required: true
      },
      fatherType: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'editAnime',
            'editPerson'
          ].indexOf(value) !== -1;
        }
      }
    },
    
    computed: {
      otherNameMaxLength () {
        return this.$store.state.business.otherNameMaxLength
      },
      otherName: {
        get () {
          return this.$store.state[this.fatherType].otherNames[this.id]
        },
        set (value) {
          this.$store.commit(`${this.fatherType}/SET_OTHER_NAME`, { id: this.id, value })
        }
      }
    },
    
    methods: {
      // 删除别名
      removeOtherName() {
        this.$store.commit(`${this.fatherType}/DELETE_OTHER_NAME`, { id: this.id })
      }
    }
  }
</script>

<style>
</style>
