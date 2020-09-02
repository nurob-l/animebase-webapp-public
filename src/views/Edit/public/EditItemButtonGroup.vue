<template>
  <div>
    <el-button type="primary" @click="$emit('submit')">提交</el-button>
    <el-button @click="$emit('preview')">预览</el-button>
    <el-button @click="$emit('save')">保存草稿</el-button>
    <el-popover class="popover-button" placement="top" v-model="deleteConfirmVisible">
      <p>删除后草稿将无法恢复，确定删除吗？</p>
      <div class="confirm-button-group">
        <el-button size="mini" type="text" @click="deleteConfirmVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="remove()">确定</el-button>
      </div>
      <el-button type="danger" slot="reference">删除草稿</el-button>
    </el-popover>
  </div>
</template>

<script>
  import { Popover, Button } from 'element-ui'
  
  export default {
    name: 'EditItemButtonGroup',
    
    components: {
      'el-popover': Popover,
      'el-button': Button
    },
    
    data() {
      return {
        deleteConfirmVisible: false
      }
    },
    
    methods: {
      remove () {
        this.deleteConfirmVisible = false
        this.$emit('remove')
      }
    }
  }
</script>

<style>
</style>
