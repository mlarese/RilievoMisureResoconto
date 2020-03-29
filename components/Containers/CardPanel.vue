<!--eslint-disable-->
<template>
    <v-card :dark="dark" slot="container-top" class="elevation-0 pa-1" style="background:#f5f5f5;border:1px solid #ddd;border-bottom:0 !important">
        <v-container grid-list-md px-0 pt-1>
        <slot>

        </slot>
        </v-container>
    </v-card>
</template>
<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
  export default {
    name: 'CardPanel',
    computed: {
      ...mapState('app', ['dark']),
    }
  }
</script>
