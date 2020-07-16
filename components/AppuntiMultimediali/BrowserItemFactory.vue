<template>
  <v-card class="pa-2 black--text" rounded>
    <component :is="currentType" :appunto="appunto" />
    <div class="caption text-align-right mt-2 grey--text">{{appunto.insert_UTCDate | time}}</div>
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
      switch (this.appunto.data.EV_Type) {
        case 'Nota':
        case 'comment':
          return 'BrowserItemComment'
          break
        case 'Immagine':
        case 'image':
        case 'set':
          if (this.appunto.listaRisorse.length == 1) {
            return 'BrowserItemImage'
          } else {
            return 'BrowserItemSet'
          }
        case 'File':
          // TODO
        default:
          return 'BrowserItemImage'
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
