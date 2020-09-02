<template>
  <div>
    <div v-if="!coverUrl" class="no-cover">没有上传封面</div>
    <div v-else class="cover-container">
      <div class="cover-box">
        <img :src="coverUrl" class="cover-image" />
        <span class="cover-actions">
          <!-- 放大图片 -->
          <span @click="coverPreview()">
            <i class="el-icon-zoom-in"></i>
          </span>
        </span>
      </div>
    </div>
    <!-- 放大图片后的查看框 -->
    <transition name="dialog" mode="out-in">
      <div v-show="coverDialogVisible" @click="coverDialogVisible = !coverDialogVisible" class="dialog-wrapper">
        <img :src="coverUrl" class="cover-dialog">
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'AuditItemCover',
    
    props: {
      fatherType: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'auditAnime',
            'auditPerson'
          ].indexOf(value) !== -1
        }
      }
    },
    
    data() {
      return {
        coverDialogVisible: false
      }
    },
    
    computed: {
      coverUrl () {
        return this.$store.state[this.fatherType].coverUrl
      }
    },
    
    methods: {
      // 放大图片
      coverPreview () {
        this.coverDialogVisible = true
      }
    }
  }
</script>

<style>
</style>