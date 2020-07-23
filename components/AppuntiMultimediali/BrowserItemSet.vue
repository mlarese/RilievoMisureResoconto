<template>
  <v-container fluid class="pa-1">
    <vue-easy-lightbox :index="index" :visible="showPreviewImages" :imgs="getimages()" @hide="handleHide()"></vue-easy-lightbox>

    <v-card flat height="180px" style="overflow-x: scroll">
      <v-row class="ma-0 pa-0 text-align-center">
        <v-col class="pa-1 ma-0" cols="6" flat v-for="(ris, i) in appunto.files" :key="i" @click="showImage(i)">
          <ResourceAvatar :risorsa="ris" :size="$vuetify.breakpoint.xsOnly ? 140 : 80" />
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col>
        <div class="body-1 align-left">{{appunto.data.EV_Descrizione}}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.listFiles {
  overflow-x: scroll;
}
::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
  height: 0px;
}
</style>

<script>
let curDate = null
import ResourceAvatar from './ResourceAvatar'
export default {
  props: ['appunto'],
  components: { ResourceAvatar },
  data() {
    return {
      showPreviewImages: false,
      index: 0
    }
  },
  methods: {
    showImage(index) {
      this.index = index
      this.showPreviewImages = true
    },
    handleHide() {
      this.showPreviewImages = false
    },
    getimages(){
      var listaImg = []
      for (const risorsa of this.appunto.files) {
        if (risorsa.type === 'image'){
          listaImg.push(risorsa.fileUrl)
        } 
      }
      return listaImg
    }
  }
}
</script>
