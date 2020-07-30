
<template>
  <v-card v-show="bShowPreview" class="modal" >
    <v-btn style="top: 60px" color="gray" absolute top right fab small @click="handleHide">
      <v-icon>mdi-close</v-icon>
    </v-btn>    
    <ResourceGallery
      ref="ResourceGallery"
      :listaRisorse="listaRisorse"
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

export default {
  props: {
    listaRisorse: { type: Array, default: [] }
  },
  components: { ResourceGallery },
  data() {
    return {
      bShowPreview: false
    }
  },
  methods: {
    showPreview(index) {
      this.bShowPreview = true
      this.$refs.ResourceGallery.setImageIndex(index)
    },
    handleHide() {
      this.bShowPreview = false
    }
  }
}
</script>