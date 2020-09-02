<template>
  <el-main class="view">
    <el-tabs class="sign-box" v-model="activeName" stretch>
      <el-tab-pane label="登录" name="signin">
        <el-form :model="formSignIn" status-icon :rules="rules" ref="formSignIn" label-width="100px" class="sign-form">
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="formSignIn.email" @keyup.enter.native="signIn()"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="formSignIn.password" autocomplete="off" @keyup.enter.native="signIn()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="signIn()">登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="注册" name="signup">
        <el-form :model="formSignUp" status-icon :rules="rules" ref="formSignUp" label-width="100px" class="sign-form">
          <el-form-item label="邮箱" prop="email2">
            <el-input type="email" v-model="formSignUp.email2" @keyup.enter.native="signUp()"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="username">
            <el-input v-model="formSignUp.username" placeholder="2-16个字符组成" @keyup.enter.native="signUp()"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input type="password" v-model="formSignUp.password2" autocomplete="off" placeholder="6-16位字符组成，区分大小写" @keyup.enter.native="signUp()"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="formSignUp.checkPass" autocomplete="off" @keyup.enter.native="signUp()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="signUp()">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
  import { Tabs, TabPane, Form, FormItem, Input, Button, Loading } from 'element-ui'
  
  export default {
    name: 'Sign',
    
    metaInfo: {
      title: '登录/注册'
    },
    
    components: {
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
    },
    
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value !== this.formSignUp.password2) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      
      return {
        activeName: 'signin',
        formSignIn: {
          email: '',
          password: ''
        },
        formSignUp: {
          email2: '',
          username: '',
          password2: '',
          checkPass: ''
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
          ],
          email2: [
            { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          username: [
            { required: true, message: '请输入昵称', trigger: ['blur', 'change'] },
            { min: 2, max: 16, message: '2-16个字符组成', trigger: ['blur', 'change'] }
          ],
          password2: [
            { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
            { min: 6, max: 16, message: '6-16个字符组成', trigger: ['blur', 'change'] }
          ],
          checkPass: [
            { required: true, message: '请再次输入密码', trigger: ['blur', 'change'] },
            { validator: validatePass2, trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    
    methods: {
      async signIn () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          // 如果检测数据不合法，error的值为返回false
          await this.$refs['formSignIn'].validate()
          
          const data = {
            email: this.formSignIn.email,
            password: this.formSignIn.password
          }
          await this.$store.dispatch('user/SIGN_IN', { data })
          
          this.$message.success('登录成功')
          this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/')
        } catch (error) {
          if(error) this.$message.error(error)
        }
        loadingInstance.close()
      },
      
      async signUp () {
        let loadingInstance = Loading.service({ fullscreen: true })
        try {
          await this.$refs['formSignUp'].validate()
          
          const data = {
            email: this.formSignUp.email2,
            username: this.formSignUp.username,
            password: this.formSignUp.password2
          }
          await this.$store.dispatch('user/SIGN_UP', { data })
          
          this.$message.success('注册成功')
          this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/')
        } catch (error) {
          if(error) this.$message.error(error)
        }
        loadingInstance.close()
      }
    }
  }
</script>

<style lang="sass">
  @import "@/assets/css/main"
  
  .sign-box
    width:500px
    margin: 200px auto
    background: white
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  
 .sign-form
    margin-top: 20px
    margin-right: 50px
</style>