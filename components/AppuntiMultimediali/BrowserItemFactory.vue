<template>


  <v-hover v-slot:default="{ hover }">

      <v-card  class="pa-2"  rounded  >
        <component  :is="currentType" :appunto="appunto" />
        <div class="caption text-align-right mt-2 grey--text ">
          <span class="mr-2">{{appunto.date | dmy}}</span> {{appunto.date | time}}
        </div>

        <v-expand-transition>
          <v-row  v-if="hover" class="d-flex transition-fast-in-fast-out text-align-left v-card--reveal caption  pl-5 mt-2"  style="height: 100%;"  >
              <table style="color:black">
                <tr><td valign="top" nowrap="nowrap"><b>Lavoro:</b></td> <td>{{appunto.job_description}}</td></tr>
                <tr><td valign="top" nowrap="nowrap"><b>Note:</b></td> <td>{{appunto.note}}</td></tr>
              </table>

          </v-row>
        </v-expand-transition>


      </v-card>

  </v-hover>

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

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  _position: absolute;
  width: 100%;
}
</style>
