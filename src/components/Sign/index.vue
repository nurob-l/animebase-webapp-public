<template>
  <v-dialog
    v-model="visible"
    persistent
    max-width="400"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isSignIn ? '帐号密码登录' : '邮箱注册' }}</span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="$emit('update:visible', false)"
          :disabled="loading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          :readonly="loading"
        >
          <v-text-field
            v-model="email"
            label="邮箱"
            :rules="emailRules"
            required
            @keyup.enter.native="isSignIn ? signIn() : signUp()"
            :error="emailError"
            :error-messages="emailErrorMessage"
            prepend-icon="mdi-email"
          ></v-text-field>
          
          <v-text-field
            v-if="!isSignIn"
            v-model="username"
            label="昵称"
            required
            :rules="usernameRules"
            hint="2-16位字符"
            @keyup.enter.native="signUp()"
            :error="usernameError"
            :error-messages="usernameErrorMessage"
            prepend-icon="mdi-account"
          ></v-text-field>
          
          <v-text-field
            v-model="password"
            label="密码"
            required
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            :rules="passwordRules"
            hint="6-16位字符"
            @click:append="showPassword = !showPassword"
            @keyup.enter.native="isSignIn ? signIn() : signUp()"
            :error="passwordError"
            :error-messages="passwordErrorMessage"
            prepend-icon="mdi-lock"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          color="info"
          @click="isSignIn ? signIn() : signUp()"
          :loading="loading"
        >{{ isSignIn ? '登录' : '注册' }}</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          text
          color="grey darken-1"
          @click="isSignIn = !isSignIn"
          :disabled="loading"
        >{{ isSignIn ? '邮箱注册' : '帐号密码登录' }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="grey darken-1"
          :disabled="loading"
        >忘记密码(还没弄)</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {
    VDialog, VCard, VCardTitle, VCardText, VCardActions, VContainer, VRow, VCol, VTextField, VForm, VSnackbar
  } from 'vuetify/lib'
  
  export default {
    name: 'Sign',
    
    components: {
      VDialog, VCard, VCardTitle, VCardText, VCardActions, VContainer, VRow, VCol, VTextField, VForm, VSnackbar
    },
    
    props: {
      visible: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    
    data: () => ({
      showPassword: false, // 密码是否可见
      isSignIn: true, // 是否在登录页，用于切换登录和注册页面
      valid: true, // 表单数据是否合法
      email: '',
      emailRules: [
        v => !!v || '请输入邮箱',
        v => /.+@.+\..+/.test(v) || '请输入正确的邮箱地址'
      ],
      emailError: false, // 服务器邮箱验证
      emailErrorMessage: '', // 邮箱输入框错误消息
      username: '',
      usernameRules: [
        v => !!v || '请输入昵称',
        v => (v.length >= 2 && v.length <= 16) || '2-16位字符'
      ],
      usernameError: false, // 服务器昵称验证
      usernameErrorMessage: '', // 昵称输入框错误消息
      password: '',
      passwordRules: [
        v => !!v || '请输入密码',
        v => (v.length >= 6 && v.length <= 16) || '6-16位字符'
      ],
      passwordError: false, // 服务器密码验证
      passwordErrorMessage: '', // 密码输入框错误消息
      loading: false
    }),
    
    watch: { // 如果服务器验证错误之后，用户在任意输入框更新数据，则消除错误状态
      email: 'clearServerErrorMessage',
      username: 'clearServerErrorMessage',
      password: 'clearServerErrorMessage',
    },
    
    methods: {
      async signIn () {
        this.loading = true
        try {
          // 如果检测数据不合法，error的值为返回false
          await this.$refs.form.validate()
          
          const data = {
            email: this.email,
            password: this.password
          }
          await this.$store.dispatch('user/SIGN_IN', { data })
          
          this.$store.commit('SET_SUCCESS_SNACKBAR', '登录成功')
          // this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/')
          // 关闭登录窗口
          this.$emit('update:visible', false)
        } catch (error) {
          if(error) {
            this.emailError = true
            this.passwordError = true
            this.passwordErrorMessage = error.message
          }
        }
        this.loading = false
      },
      
      async signUp () {
        this.loading = true
        try {
          await this.$refs.form.validate()
          
          const data = {
            email: this.email,
            username: this.username,
            password: this.password
          }
          await this.$store.dispatch('user/SIGN_UP', { data })
          
          this.$store.commit('SET_SUCCESS_SNACKBAR', '注册成功')
          // this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/')
          this.$emit('update:visible', false)
        } catch (error) {
          if(error) {
            switch (error.code) {
              case 'auth:email_used':
                this.emailError = true
                this.emailErrorMessage = error.message
                break
              case 'auth:name_used':
                this.usernameError = true
                this.usernameErrorMessage = error.message
                break
              default:
                this.emailError = true
                this.usernameError = true
                this.passwordError = true
                this.passwordErrorMessage = error.message
            }
          }
        }
        this.loading = false
      },
      
      // 清空服务端验证的错误状态
      clearServerErrorMessage () {
        this.emailError = false
        this.usernameError = false
        this.passwordError = false
        this.emailErrorMessage = ''
        this.usernameErrorMessage = ''
        this.passwordErrorMessage = ''
      }
    }
  }
</script>

<style>
</style>
