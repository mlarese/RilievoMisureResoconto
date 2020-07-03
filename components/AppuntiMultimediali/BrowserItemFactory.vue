<template>
  <v-card  class="pa-2 mx-1" _height="200px" rounded >
    <component  :is="currentType" :appunto="appunto" />
    <div class="caption text-align-right" >
      {{ appunto.insert_UTCDate | time}}
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
      if (this.appunto.data.EV_Type==='comment') return 'BrowserItemComment'
      else if(this.appunto.data.EV_Type==='image') return 'BrowserItemImage'
      else if(this.appunto.data.EV_Type==='set') return 'BrowserItemSet'
      else return 'BrowserItemSet'
    }
  },
  props: ['appunto']
}
</script>
