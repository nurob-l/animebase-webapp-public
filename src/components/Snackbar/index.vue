<template>
  <v-snackbar
    v-model="showSnackbar"
    app
    top
    text
    :color="color"
    :timeout="duration"
  >
    <v-icon :color="color">{{ icons[color] }}</v-icon>
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        :color="color"
        icon
        v-bind="attrs"
        @click="showSnackbar = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  export default {
    name: 'SnackBar',
    
    data: () =>({
      icons: {
        'info': 'mdi-alert-circle',
        'success': 'mdi-check',
        'error': 'mdi-alert'
      },
      duration: 3000 // 消息条显示时间（3秒），时间过后v-snackbar组件会自动将showSnackbar的值设置为false
    }),
    
    computed: {
      showSnackbar: {
        get () {
          return this.$store.state.settings.snackbar.show
        },
        set (value) {
          this.$store.commit('SET_SNACKBAR', { show: value })
        }
      },
      
      color () {
        return this.$store.state.settings.snackbar.color
      },
      
      message () {
        return this.$store.state.settings.snackbar.message
      }
    }
  }
</script>

<style>
</style>
