<template>
    <v-bottom-navigation app>
        <v-btn  v-if="$router.currentRoute.path!=item.to" v-for="(item, i) in menuItems" :key="i" :value="item.to" :to="item.to">
            <span>{{item.title}}</span>
            <v-icon>{{item.icon}}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <slot name="right"></slot>
    </v-bottom-navigation>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: 'BottomNavigation',
    computed: {
      ...mapState('app', ['menuItems'])
    }
  }
</script>
