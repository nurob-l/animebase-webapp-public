<template>
  <div class="batch-fill">
    <el-input class="input" type="textarea" :autosize="{minRows: 5}" v-model="content"
      :placeholder="`原作：荒川弘\n导演：入江泰浩\n系列构成：大野木宽\n...`"></el-input>
    <div class="popover-buttons">
      <el-popover placement="top" title="说明" width="250" trigger="hover" class="translate-popover">
        <p>在填充框中按以下格式填写好信息，可以将日文翻译成对应中文</p>
        <div>职位1：人员1</div>
        <div>职位2：人员2</div>
        <div>...</div>
        <div>职位n：人员n</div>
        <p class="thick"><a href="/dictionary" target="_blank">目前只能翻译词表中存在的词，欢迎指正或补充。</a></p>
        <el-button slot="reference" type="primary" @click="translate()">翻译</el-button>
      </el-popover>
      <el-popover placement="top" v-model="ConfirmVisible" title="说明" width="250" class="batchfill-popover">
        <p>在填充框中按以下格式填写好信息，可以一键填充到staff表</p>
        <div>职位1：人员1</div>
        <div>职位2：人员2</div>
        <div>...</div>
        <div>职位n：人员n</div>
        <p>填充会覆盖当前列表，确定填充吗？</p>
        <div class="confirm-button-group">
          <el-button size="mini" type="text" @click="ConfirmVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="batchFill()">确定</el-button>
        </div>
        <el-button slot="reference" type="primary">批量填充</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
  import { Input, Popover, Button, Loading } from 'element-ui'
  
  export default {
    name: 'EditItemStaffBatchFill',
    
    components: {
      'el-input': Input,
      'el-popover': Popover,
      'el-button': Button
    },
    
    data() {
      return {
        content: '',
        ConfirmVisible: false
      }
    },
    
    methods: {
      batchFill () {
        this.ConfirmVisible = false
        this.$emit('batchFill', this.content)
      },
      
      async translate () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await Promise.all([
            this.$store.dispatch('FETCH_DICTIONARY', { type: 'positions' }),
            this.$store.dispatch('FETCH_DICTIONARY', { type: 'persons' })
          ])
          // 翻译
          this.content = this.content.split(/[\f\n\r\v]/).map(data => {
              if (!data.trim()) return ''
              let item = data.split(/[:：]/)
              item[0] = this.$store.getters.translatePosition(item[0])
              item[1] = this.$store.getters.translatePerson(item[1])
              return item.join('：')
            }).filter(_ => _).join('\n')
          this.$message.success('翻译完成')
        } catch (error) {
          this.$message.error(error)
        }
        loadingInstance.close()
      }
    }
  }
</script>

<style>
</style>
