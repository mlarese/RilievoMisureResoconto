<template>
  <v-app dark>
    <notifications position="top right" style="margin-top:50px"/>
    <v-navigation-drawer clipped v-model="drawer" fixed app  >
      <v-list>
        <v-list-item v-for="(item, i) in menuItems"   :key="i" :to="item.to" router exact >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar :clipped-left="true" fixed app class="elevation-0">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>

    <!-- v-footer fixed app> </v-footer -->
  </v-app>
</template>

<script>
  import 'devextreme/dist/css/dx.common.css'
  import 'devextreme/dist/css/dx.light.css'
  import '../assets/md-devexp.min.css'
  import {mapState} from 'vuex'

  export default {
  data() {
    return {
      bottomNavActiveItem: '/',
      drawer: (this.$vuetify.breakpoint.name==='lg' || this.$vuetify.breakpoint.name==='xl' ),
    }
  },
  watch: {
    'notification.id' (val) {
      this.$notify(this.notification)
    }
  },
  computed: {
    ...mapState('api', ['notification']),
    ...mapState('app', ['title', 'menuItems'])
  }
}
</script>
