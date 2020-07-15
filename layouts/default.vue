<template>
  <v-app :dark="dark">
    <notifications position="top right" style="margin-top:50px" />

    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      style="background: white;"
    >
      <!-- <v-img
        contain
        :src="require('../assets/images/logo.png')"
        class="mt-5 mx-5"
      />-->

      <v-list dense class="mt-1">
        <v-list-item two-line @click="openProfile()" style="cursor: pointer;">
          <v-list-item-avatar>
            <img :src="require('../assets/images/user.png')" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{utenteDesc}}</v-list-item-title>
            <v-list-item-subtitle>{{aziendaDesc}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

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

    <v-app-bar app clipped-left color="grey lighten-4" class="elevation-5 pl-1 mb-3">
      <slot name="header-left">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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
        <portal-target name="app-bar-right"></portal-target>

        <!-- <v-badge
          v-if="false"
          :content="countMessages"
          :value="countMessages"
          color="primary"
          medium
          overlap
          class="ml-0 mr-1"
        >
          <v-icon medium>mdi-email</v-icon>
        </v-badge>
        <v-avatar color="primary" class="ma-0" size="36px" @click="openProfile">
          <v-icon dark>person</v-icon>
        </v-avatar>-->
      </slot>
      <template v-slot:extension v-if="$vuetify.breakpoint.xsOnly">
        <v-tabs v-model="tab" fixed-tabs>
          <v-tabs-slider color="accent"></v-tabs-slider>
          <v-tab v-for="(item, i) in getMenuItems_Tab" :key="i" :to="item.to">
            <v-icon>{{ item.icon }}</v-icon>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="tab" @change="tabChanged" v-if="$vuetify.breakpoint.xsOnly">
      <v-tab-item v-for="(item, i) in getMenuItems_Tab" :key="i" :value="item.to" :touchless="true">
        <v-content>
          <v-container fluid>
            <nuxt />
          </v-container>
        </v-content>
      </v-tab-item>
    </v-tabs-items>

    <v-content>
      <v-container fluid v-if="$vuetify.breakpoint.smAndUp">
        <nuxt />
      </v-container>
    </v-content>

    <v-dialog v-model="isDialogProfileVisible" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Profilo utente</v-card-title>
        <v-card-text>
          <v-input
            persistent-hint
            hint="Utente"
            prepend-icon="mdi-account-check-outline"
            class="py-2"
          >{{ utenteDesc }}</v-input>
          <v-input
            persistent-hint
            hint="Azienda"
            prepend-icon="mdi-factory"
            class="py-2"
          >{{ aziendaDesc }}</v-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray darken-1" text @click="logout">Logout</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="isDialogProfileVisible = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      bottomNavActiveItem: '/',
      showMessageBadge: false,
      isDialogProfileVisible: false,
      drawer:
        this.$vuetify.breakpoint.name === 'lg' ||
        this.$vuetify.breakpoint.name === 'xl',
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
    ...mapGetters('app', ['getMenuItems_Drawer', 'getMenuItems_Tab']),
    ...mapState('auth', ['utenteDesc', 'aziendaDesc'])
  },
  methods: {
    ...mapMutations('app', { setTitlePage: 'setTitle' }),
    isBadgeMessageVisibile() {
      return countMessages > 0
    },
    tabChanged(e) {
      this.$router.push(e)
    },
    openProfile() {
      this.drawer = false
      this.isDialogProfileVisible = true
    },
    ...mapActions('auth', ['doLogout']),
    logout() {
      this.doLogout()
        .then()
        .then(() => {
          this.$router.push('/login')
        })
    }
  }
}
</script>
