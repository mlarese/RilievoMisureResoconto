<template>
  <v-container fluid class="pa-1">

    <v-card flat class="d-flex" height="180px" style="max-width: calc(100%); overflow-x: auto">
      <!-- <v-row class="ma-0 pa-0 text-align-center d-flex">
      </v-row> -->
        <div
          class="pa-1 ma-0"
          
          v-for="(ris, i) in appunto.files"
          :key="i"
          @click="showImage(i)"
        >
          <!-- <ResourceAvatar :risorsa="ris" :size="$vuetify.breakpoint.xsOnly ? 80 : 80" /> -->
          <v-img :src="ris.thumbnailUrl" :style="{width: '80px', height:'100%'}"></v-img>
        </div>
    </v-card>

    <v-row>
      <v-col>
        <div class="body-1 align-left">{{appunto.data.EV_Descrizione}}</div>
      </v-col>
    </v-row>

    <GalleryBox ref="GalleryBox" :listaRisorse="appunto.files" />
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
import GalleryBox from '../Risorse/GalleryBox'
import ResourceAvatar from '../Risorse/ResourceAvatar'

export default {
  props: ['appunto'],
  components: { ResourceAvatar, GalleryBox },
  methods: {
    showImage(index) {
      this.$refs.GalleryBox.showPreview(index)
    }
  }
}
</script>
