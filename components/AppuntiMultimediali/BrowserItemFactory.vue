<template>
  <v-card class="pa-2 black--text" rounded>
    <component :is="currentType" :appunto="appunto" />
    <div class="d-flex flex-row pt-2">
      <div class="caption text-align-lef grey--text text-truncate pr-1">{{appunto.data.ClassificazioneDesc}}</div>
      <div class="ml-auto caption grey--text">{{appunto.insert_UTCDate | time}}</div>
    </div>
  </v-card>
</template>
<script>
import BrowserItemComment from './BrowserItemComment'
import BrowserItemImage from './BrowserItemImage'
import BrowserItemSet from './BrowserItemSet'
let curDate = null

export default {
  components: { BrowserItemComment, BrowserItemImage, BrowserItemSet },
  computed: {
    currentType() {

      if (!this.appunto.listaRisorse){
        return 'BrowserItemComment'
      }

      switch (this.appunto.listaRisorse.length) {
        case 0:
          return 'BrowserItemComment'
          break
        case 1:
          return 'BrowserItemImage'
          break
        default:
          return 'BrowserItemSet'
          break
      }

      // if (this.appunto.data.EV_Type === 'Nota') return 'BrowserItemComment'
      // if (this.appunto.data.EV_Type === 'Immagine') {
      //   if (this.appunto.listaRisorse.length == 1) {
      //     return 'BrowserItemImage'
      //   } else {
      //     return 'BrowserItemSet'
      //   }
      // }

      // else if(this.appunto.data.EV_Type==='image') return 'BrowserItemImage'
      // else if(this.appunto.data.EV_Type==='set') return 'BrowserItemSet'
      // else return 'BrowserItemSet'
    }
  },
  props: ['appunto']
}
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  _position: absolute;
  width: 100%;
}
</style>
