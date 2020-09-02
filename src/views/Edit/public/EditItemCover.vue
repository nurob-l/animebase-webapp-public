<template>
  <div>
    <el-upload
      class="cover-uploader"
      action="#"
      name="cover"
      :show-file-list="false"
      :http-request="selectLocalImg"
      v-if="!coverUrl">
      <i class="el-icon-plus cover-uploader-icon"></i>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过1MB</div> -->
    </el-upload>
    <div v-else class="cover-container">
      <div class="cover-box">
        <img :src="coverUrl" class="cover-image" />
        <span class="cover-actions">
          <span @click="coverPreview()">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span @click="coverRemove()">
            <i class="el-icon-delete"></i>
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
    <!-- vueCropper 剪裁图片实现-->
    <!-- el-dialog官方自带style="margin-top: 15vh;"，无奈只能先用style="margin-top: -10vh;"抵消一下 -->
    <el-dialog title="图片剪裁" :visible.sync="cropperDialogVisible" style="margin-top: -10vh;">
      <div class="cropper">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :full="option.full"
          :fixedBox="option.fixedBox"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :mode="option.mode"></vueCropper>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropperDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="getCropBlob()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Upload, Dialog, Button } from 'element-ui'
  import { VueCropper } from 'vue-cropper'
  
  export default {
    name: 'EditItemCover',
    
    components: {
      'el-upload': Upload,
      'el-dialog': Dialog,
      'el-button': Button,
      VueCropper
    },
    
    props: {
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
    
    data() {
      return {
        coverDialogVisible: false,
        cropperDialogVisible: false,
        localCoverFileName:'', //本地封面图片文件地址
        // 裁剪组件的基础配置option
        option: {
          img: '', // 裁剪图片的地址
          outputSize: 0.8, // 裁剪生成图片的质量
          outputType: 'webp', // 裁剪生成图片的格式
          info: true, // 裁剪框的大小信息
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 450, // 默认生成截图框宽度
          autoCropHeight: 640, // 默认生成截图框高度
          fixed: false, // 是否开启截图框宽高固定比例
          fixedNumber: [7, 10], // 截图框的宽高比例
          full: false, // 是否输出原图比例的截图
          fixedBox: true, // 固定截图框大小 不允许改变
          canMoveBox: false, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: false, // 截图框是否被限制在图片里面
          infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          mode: 'contain' // 图片默认渲染方式 contain , cover, 100px, 100% auto, 默认contain
        }
      }
    },
    
    computed: {
      coverUrl () {
        return this.$store.state[this.fatherType].cover.coverUrl
      },
      localCoverBlobData () { // 本地待上传的裁剪后的封面图片数据
        return this.$store.state[this.fatherType].cover.localCoverBlobData
      }
    },
    
    methods: {
      //选择要剪裁的本地图片
      selectLocalImg (event) {
        let that = this
        let file = event.file // 获取本地图片
        let isImage = file.type.indexOf('image') != -1 // 判断是否是图片类型
        
        if (!isImage) {
          that.$message.error('您选择的文件不是图片, 请重新选择')
          return false
        }
        that.localCoverFileName = file.name // 获取本地图片名字
        
        let reader = new FileReader()
        reader.onload = function(e) { // 读取文件后的回调函数
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob, 如果是base64不需要, 并创建url
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          that.option.img = data
          that.cropperDialogVisible = true
        }
        
        // reader.readAsDataURL(file) // 转化为base64
        reader.readAsArrayBuffer(file) // 转化为blob
      },
      
      // 获取截图的blob数据
      getCropBlob () {
        let that = this
        that.$refs.cropper.getCropBlob((data) => {
          that.$store.commit(`${that.fatherType}/cover/SET_LOCAL_COVER_BLOB_DATA`, { value: data })
          // // 为blob数据创建url
          that.$store.commit(`${that.fatherType}/cover/SET_COVER_URL`, { value: window.URL.createObjectURL(data) })
          that.cropperDialogVisible = false
        })
      },
      
      // 放大图片
      coverPreview () {
        this.coverDialogVisible = true
      },
      
      // 删除图片
      coverRemove () {
        // 先检测要删除的图片是本地上传的图片还是图床中的图片
        if(this.localCoverBlobData) {
          window.URL.revokeObjectURL(this.coverUrl)
          this.$store.commit(`${this.fatherType}/cover/CLEAR_COVER_URL`)
          this.$store.commit(`${this.fatherType}/cover/CLEAR_LOCAL_COVER_BLOB_DATA`)
        } else {
          this.$store.commit(`${this.fatherType}/cover/CLEAR_COVER_URL`)
        }
      }
    }
  }
</script>

<style>
</style>