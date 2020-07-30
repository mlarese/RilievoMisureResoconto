<template>
  <div style="height: 100%">
    <div style="height: 100%" v-if="(risorsa)">
      <component :is="currentType" :src="risorsa.fileUrl" :typeFile="risorsa.typeFile" style="z-index: 0" />

        <div v-if="editable" class="d-flex justify-center">
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

    <div v-else style="height: 100%" class="d-flex align-center justify-center">
      <span>Nessun file selezionato</span>
    </div>
  </div>
</template>

<style scoped>
.toolbarOption {
  opacity: 70%;
  background-color: black;
  height: 40px;
  z-index: 10;
  bottom: 60px;
}
.content {
  z-index: 0;
}
</style>

<script>

import { mapActions, mapState, mapGetters } from 'vuex'
import ResourceItemImage from './ResourceItemImage'
import ResourceItemAudio from './ResourceItemAudio'
import ResourceItemPdf from './ResourceItemPdf'
import ResourceItemVideo from './ResourceItemVideo'

export default {
  components: {
    ResourceItemImage,
    ResourceItemAudio,
    ResourceItemPdf,
    ResourceItemVideo
  },
  props: {
    risorsa: {
      type: Object,
      default: {}
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      defautt: false
    }
  },
  computed: {
    currentType() {
      switch (this.risorsa.type) {
        case 'video':
          return 'ResourceItemVideo'
          break
        case 'audio':
          return 'ResourceItemAudio'
          break
        case 'pdf':
          return 'ResourceItemPdf'
          break
        default:
          return 'ResourceItemImage'
          break
      }
    }
  },
  methods: {
    editFile(){
      
    }
  }
}
</script>