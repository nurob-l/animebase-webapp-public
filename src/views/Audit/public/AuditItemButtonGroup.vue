<template>
  <div>
    <el-button @click="$emit('preview')">预览</el-button>
    <el-popover class="popover-button" placement="top" v-model="approveConfirmVisible">
      <p>审核通过后将公开在网站中，确定通过吗？</p>
      <div class="confirm-button-group">
        <el-button size="mini" type="text" @click="approveConfirmVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="approve()">确定</el-button>
      </div>
      <el-button type="primary" slot="reference">通过</el-button>
    </el-popover>
    <el-popover class="popover-button" placement="top" v-model="denyConfirmVisible">
      <p>请填写审核不通过的理由</p>
      <el-input
        type="textarea"
        :autosize="{minRows: 3}"
        v-model="auditorMessage"
        :maxlength="auditorMessageMaxLength"
        show-word-limit></el-input>
      <div class="confirm-button-group">
        <el-button size="mini" type="text" @click="denyConfirmVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="deny()">确定</el-button>
      </div>
      <el-button type="danger" slot="reference">不通过</el-button>
    </el-popover>
  </div>
</template>

<script>
  import { Input, Popover, Button } from 'element-ui'
  
  export default {
    name: 'EditItemButtonGroupAudit',
    
    props: {
      fatherType: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'auditAnime',
            'auditPerson'
          ].indexOf(value) !== -1;
        }
      }
    },
    
    components: {
      'el-input': Input,
      'el-popover': Popover,
      'el-button': Button
    },
    
    data() {
      return {
        approveConfirmVisible: false,
        denyConfirmVisible: false
      }
    },
    
    computed: {
      auditorMessageMaxLength () {
        return this.$store.state.business.auditorMessageMaxLength
      },
      
      auditorMessage: {
        get () {
          return this.$store.state[this.fatherType].auditorMessage
        },
        set (value) {
          this.$store.commit(`${this.fatherType}/SET_AUDITOR_MESSAGE`, { value })
        }
      }
    },
    
    methods: {
      approve () {
        this.approveConfirmVisible = false
        this.$emit('approve')
      },
      
      deny () {
        if(!this.auditorMessage.trim()) {
          this.$message.error('理由不能为空')
          return
        }
        this.denyConfirmVisible = false
        this.$emit('deny')
      }
    }
  }
</script>

<style>
</style>