
<template>
  <v-card v-show="gallery.isShowingGallery" class="modal" >
    <v-btn style="top: 60px" color="gray" absolute top right fab small @click="handleHide">
      <v-icon>mdi-close</v-icon>
    </v-btn>    
    <ResourceGallery
      ref="ResourceGallery"
      :listaRisorse="gallery.listaRisorseGallery"
      style="height: calc(100% - 20px); width: 100%;"
      class="ma-0"
      :editable="false"
    />
  </v-card>
</template>

<style scoped>
.modal {
  position: fixed; /* Stay in place */
  z-index: 10; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.8); /* Black w/ opacity */
}
</style>

<script>
import ResourceGallery from '../Risorse/ResourceGallery'
import { mapState, mapMutations } from 'vuex'

export default {
  components: { ResourceGallery },
  // data(){
  //   return{
  //     listaRis: []
  //   }
  // },
  computed: {
    ...mapState('appuntimm', ['gallery']),
  },
  watch: {
    gallery: {
     handler(val){
       this.$refs.ResourceGallery.setRisorsaSelezionata(val.listaRisorseGallery[val.index])
     },
     deep: true
  }
  },
  methods: {
      ...mapMutations('appuntimm', ['hideGallery', 'showGallery']),
    handleHide() {
      this.hideGallery()
    }
  }
}
</script>