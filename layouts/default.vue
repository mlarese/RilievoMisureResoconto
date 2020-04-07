<template>
  <v-app :dark="dark">
    <notifications position="top right" style="margin-top:50px" />

    <!--    <v-app-bar :dark="dark" :clipped-left="true" fixed  dense class="elevation-0">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>-->

    <v-navigation-drawer
      :dark="dark"
      clipped
      v-model="drawer"
      fixed
      app
      floating
      style="background: #213F4A;"
    >
      <v-img
        contain
        :src="require('../assets/images/logo2.png')"
        style="height:40px;"
        class="mt-1"
      />

      <v-list dense>
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
            <!--<span class="white--text headline">VB</span>-->
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-subtitle>Buongiorno,</v-list-item-subtitle>
            <v-list-item-title>Administrator</v-list-item-title>
          </v-list-item-content>

          <!--     <v-list-item-icon>
          <v-icon v-if="item.icon" color="pink">mdi-star</v-icon>
          </v-list-item-icon>-->
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item v-for="(item, i) in menuItems" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!--       <template v-slot:append>
        <div class="pa-2">
          <v-btn color="light-blue accent-3" block small>LOGOUT</v-btn>
        </div>
      </template>-->
    </v-navigation-drawer>

    <v-content style="background: #EEEEEE;">
      <v-toolbar style="background: #213F4A;" app dark dense fixed class="elevation-5 pl-5 mb-3">
        <slot name="header-left">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-toolbar-title class="subtitle-1">
            <b>{{ title }}</b>
          </v-toolbar-title>
        </slot>
        <v-spacer />
        <slot name="header-right"></slot>
      </v-toolbar>
      <v-container fluid :dark="dark">
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :dark="dark" app fixed style="background: #213F4A;" class="font-weight-regular" height="20px">
      <v-card-text>
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-card-text>
    </v-footer>
  </v-app>
</template>

<script>
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import '../assets/md-devexp.min.css'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      bottomNavActiveItem: '/',
      drawer:
        this.$vuetify.breakpoint.name === 'lg' ||
        this.$vuetify.breakpoint.name === 'xl'
    }
  },
  watch: {
    'notification.id'(val) {
      this.$notify(this.notification)
    }
  },
  computed: {
    ...mapState('api', ['notification']),
    ...mapState('app', ['title', 'menuItems', 'dark'])
  }
}
</script>
