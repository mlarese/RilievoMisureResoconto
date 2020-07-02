<template>
  <v-card  class="pa-2" _height="200px" rounded >
    <component  :is="currentType" :appunto="appunto" />
    <div class="caption text-align-right">
      {{appunto.date | time}}
    </div>
  </v-card>
</template>
<script>
import BrowserItemComment from './BrowserItemComment'
import BrowserItemImage from './BrowserItemImage'
import BrowserItemSet from './BrowserItemSet'
let curDate = null

export default {
  components: {BrowserItemComment, BrowserItemImage, BrowserItemSet},
  computed: {
    currentType () {
      if(this.appunto.type==='comment') return 'BrowserItemComment'
      else if(this.appunto.type==='image') return 'BrowserItemImage'
      else if(this.appunto.type==='set') return 'BrowserItemSet'
      else return 'BrowserItemComment'
    }
  },
  props: ['appunto']
}
</script>
