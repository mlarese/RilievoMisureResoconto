<template >
  <div >
    <!-- keep-alive>
        <ComponentIpad v-if="!$vuetify.breakpoint.xs" />
        <ComponentIphone v-if="$vuetify.breakpoint.xs"/>
    </keep-alive -->

        <keep-alive>
          <component :is="currentComponent" v-bind="{titolo: 'Applicazione'}" />
        </keep-alive>

    <v-btn @click="setIpad" > Ipad  </v-btn>
    <v-btn @click="setIphone">  Iphone  </v-btn>
  </div>
</template>

<script>
// import ComponentIpad from './ComponentIpad'
// import ComponentIphone from './ComponentIphone'

export default {
  data () {
    return {
      currentView: 'ComponentIpad'
    }
  },
  methods: {
    onResize () {
      console.log('--- resize')
      if(this.$vuetify.breakpoint.xs)
        this.currentView = 'ComponentIphone'
      else
        this.currentView = 'ComponentIpad'
    },
    setIpad () {  this.currentView = ComponentIpad },
    setIphone () {  this.currentView = ComponentIphone }
  },
  computed: {
    currentComponent () {
      if(this.$vuetify.breakpoint.xs)
        return 'ComponentIphone'
      else
        return 'ComponentIpad'
    }
  },
  components: {
    ComponentIpad: () => import('./ComponentIpad'),
    ComponentIphone: () => import('./ComponentIphone')
  },
  props: []
}
</script>
