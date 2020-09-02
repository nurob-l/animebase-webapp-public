<template>
  <div class="batch-fill">
    <el-input class="input" type="textarea" :autosize="{minRows: 5}" v-model="content"
      :placeholder="`谷风长道：逢坂良太\n星白闲：洲崎绫\n科户濑伊扎那：丰崎爱生\n...`"></el-input>
    <div class="popover-buttons">
      <el-popover placement="top" title="说明" width="250" trigger="hover" class="translate-popover">
        <p>在填充框中按以下格式填写好信息，可以翻译声优名字</p>
        <div>角色1：声优1</div>
        <div>角色2：声优2</div>
        <div>...</div>
        <div>角色n：声优n</div>
        <p class="thick"><a href="/dictionary" target="_blank">目前只能翻译词表中存在的词，欢迎指正或补充。</a></p>
        <el-button slot="reference" type="primary" @click="translate()">翻译</el-button>
      </el-popover>
      <el-popover placement="top" v-model="ConfirmVisible" title="说明" width="250" class="batchfill-popover">
        <p>在填充框中按以下格式填写好信息，可以一键填充到cast表</p>
        <div>角色1：声优1</div>
        <div>角色2：声优2</div>
        <div>...</div>
        <div>角色n：声优n</div>
        <p>填充会覆盖当前列表，确定填充吗？</p>
        <div class="confirm-button-group">
          <el-button size="mini" type="text" @click="ConfirmVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="batchFill()">确定</el-button>
        </div>
        <el-button type="primary" slot="reference">批量填充</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
  import { Input, Popover, Button, Loading } from 'element-ui'
  
  export default {
    name: 'EditItemCastBatchFill',
    
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
      batchFill() {
        this.ConfirmVisible = false
        this.$emit('batchFill', this.content)
      },
      
      async translate () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$store.dispatch('FETCH_DICTIONARY', { type: 'persons' })
          // 翻译
          this.content = this.content.split(/[\f\n\r\v]/).map(data => {
              if (!data.trim()) return ''
              let item = data.split(/[:：]/)
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
