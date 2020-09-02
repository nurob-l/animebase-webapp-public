import Vue from 'vue'
import Vuetify, {
  VApp, VNavigationDrawer, VAppBar, VMain, VContainer, VFooter, VBottomNavigation,
  VIcon, VBtn, VSpacer, VRow, VCol
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VApp, VNavigationDrawer, VAppBar, VMain, VContainer, VFooter, VBottomNavigation,
    VIcon, VBtn, VSpacer, VRow, VCol
  }
})

const opts = {}

export default new Vuetify(opts)