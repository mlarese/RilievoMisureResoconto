<template>
  <v-app :dark="dark">
    <nuxt/>
  </v-app>
</template>



<script>
import { mapState } from 'vuex'
export default {
  name: 'fullPage',
  computed: {
    ...mapState('app', ['menuItems', 'dark'])
  }
}
</script>