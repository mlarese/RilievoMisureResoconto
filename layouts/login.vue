<!--eslint-disable-->
<template>
  <v-app id="inspire" class="transparent">
    <notifications position="top right" />
    <v-main class="back-city">
      <v-container fluid fill-height class="transparent">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    head () {
      return {
        title: 'Rilievo misure',
      }
    },
    computed: {
      ...mapState('app', ['title']),
      ...mapState('api', ['notification'])
    },
    watch: {
      'notification.id' (val) {
        this.$notify(this.notification)
      }
    }
  }
</script>
