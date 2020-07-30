<template>
  <div v-if="(risorsa)">
    <div class="text-align-center overflow-x: hidden">
      <div
        class="text-align-center"
        style="max-height: 250px; overflow: hidden"
        @click="showImage()"
      >
        <img width="100%" :src="risorsa.thumbnailUrl || '/images/img-placeholder.png'" />
      </div>
      <div class="body-2 align-left mt-1">{{ appunto.data.EV_Descrizione }}</div>
    </div>

    <GalleryBox ref="GalleryBox" :listaRisorse="this.appunto.files" />
  </div>
</template>

<script>
import GalleryBox from '../Risorse/GalleryBox'
import { mapState, mapGetters, mapActions } from 'vuex'
import { appuntimm } from './browsermx'
let curDate = null

const newRisorsa = {
  fileUrl: '',
  typeFile: '',
  type: '',
  thumbnailUrl: ''
}

export default {
  mixins: [appuntimm],
  components: { GalleryBox },
  props: ['appunto'],
  data() {
    return {
      risorsa: newRisorsa,
      showPreviewImages: false,
    }
  },
  methods: {
    showImage(index) {
      this.showPreviewImages = true
      this.$refs.GalleryBox.showPreview(0)
    }
  },
  mounted() {
    this.risorsa = this.appunto.files[0]
  }
}
</script>
