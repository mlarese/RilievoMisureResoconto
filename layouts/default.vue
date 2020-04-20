<template>
  <v-app :dark="dark">
    <notifications position="top right" style="margin-top:50px" />

    <v-app-bar :clipped-left="true" fixed app color="grey lighten-4" class="elevation-5 pl-1 mb-3">
      <slot name="header-left">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <!--  <v-toolbar-title>
          <b>{{ title }}</b>
        </v-toolbar-title>-->
        <v-img
          contain
          height="30"
          width="30px"
          position="left"
          :src="require('../assets/images/logo.png')"
        />
      </slot>
      <v-spacer />
      <slot name="header-right">
        <v-badge
          v-if="isBadgeMessageVisibile"
          :content="countMessages"
          :value="countMessages"
          color="primary"
          medium
          overlap
          class="ma-4"
        >
          <v-icon medium>mdi-email</v-icon>
        </v-badge>
        <v-avatar color="primary" class="ma-4" size="36px">
          <v-icon dark>person</v-icon>
        </v-avatar>
      </slot>
      <template v-slot:extension>
        <v-tabs v-model="tab">
          <v-tabs-slider color="accent"></v-tabs-slider>
          <v-tab v-for="(item, i) in getMenuItems_Tab" :key="i" :to="item.to">
            <v-icon>{{item.icon}}</v-icon>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item, i) in getMenuItems_Tab" :key="i" :value="item.to" :touchless="true">
         <v-content>
          <v-container fluid> 
            <nuxt />
          </v-container>
        </v-content> 
      </v-tab-item>
    </v-tabs-items>

    <v-navigation-drawer v-model="drawer" :clipped="true" fixed app style="background: white;">
      <v-img contain :src="require('../assets/images/logo.png')" class="mt-5 mx-5" />

      <v-list dense class="mt-1">
        <v-list-item v-for="(item, i) in getMenuItems_Drawer" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>


<script>
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import '../assets/md-devexp.min.css'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      bottomNavActiveItem: '/',
      showMessageBadge: false,
      drawer: this.$vuetify.breakpoint.name === 'lg' || this.$vuetify.breakpoint.name === 'xl',
      tab: null
    }
  },
  watch: {
    'notification.id'(val) {
      this.$notify(this.notification)
    }
  },
  computed: {
    ...mapState('api', ['notification']),
    ...mapState('app', ['title', 'menuItems', 'dark', 'countMessages']),
    ...mapGetters('app', ['getMenuItems_Drawer', 'getMenuItems_Tab'])
  },
  methods: {
    ...mapMutations('app', { setTitlePage: 'setTitle' }),
    isBadgeMessageVisibile() {
      return countMessages > 0
    }
  }
}
</script>
