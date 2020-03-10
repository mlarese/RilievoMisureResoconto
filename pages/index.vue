<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>

    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import DxButton from 'devextreme-vue/button'

export default {
  fetch ({store}) {
    store.dispatch('sync/importLavori',{}, {root: true})
  }
}
</script>
