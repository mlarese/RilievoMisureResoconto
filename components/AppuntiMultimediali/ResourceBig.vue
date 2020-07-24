<template>
  <div >
    <div v-if="(risorsa)">
      <v-card flat :height="maxHeight"  class="d-flex align-center justify-center">
        <div v-if="risorsa.type === 'image'" class="content">
          <v-img
            :src="risorsa.fileUrl"
            :style="{'max-height': maxHeight + 'px', 'max-width': maxWidth + 'px', 'z-index': 0 }"
          />
        </div>

        <div v-if="risorsa.type === 'pdf'" class="content">
          <embed :src="risorsa.fileUrl" :width="maxWidth" :height="maxHeight" />
        </div>

        <div v-else-if="risorsa.type === 'video'">
          <video :style="{width: '100%', 'max-height': maxHeight + 'px'}" controls>
            <source :src="risorsa.fileUrl" :type="risorsa.typeFile" />Your browser does not support HTML video.
          </video>
        </div>

        <div v-else-if="risorsa.type === 'audio'">
          <audio :style="{width: '300px', 'max-height': maxHeight + 'px'}" controls>
            <source :src="risorsa.fileUrl" :type="risorsa.typeFile" />Your browser does not support the audio element.
          </audio>
        </div>
      </v-card>
      <div class="d-flex justify-center">
        <v-card class="toolbarOption px-2" :style="{ opacity: '70%' }">
          <v-btn dark icon @click="editFile()" v-if="risorsa.type === 'image'">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn dark icon @click="$emit('onRemoveCurrentFile')">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card>
      </div>
    </div>

    <div v-else style="height: 100%"  class="d-flex align-center justify-center">
      <span>Nessun file selezionato</span>
    </div>
  </div>
</template>

<style scoped>
.toolbarOption {
  opacity: 70%;
  background-color: black;
  height: 40px;
  z-index: 1;
  bottom: 60px;
}
.content {
  z-index: 0;
}
</style>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  props: {
    risorsa: { default: null },
    maxHeight: { defautl: 200 },
    maxWidth: { default: 200 }
  },
  // data() {
  //   return {
  //     risorsa: ''
  //   }
  // },
  // methods: {
  //   ...mapActions('dm_resources', ['getUrlFromBlob']),
  //   async loadImage() {
  //     if (this.file) {
  //       this.risorsa = await this.getUrlFromBlob(this.file)
  //     }
  //   },
  //   editFile() {},
  // },
  // mounted() {
  //   this.loadImage()
  // }
}
</script>