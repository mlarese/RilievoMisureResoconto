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

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
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
  props: ['appunto'],
  data() {
    return {
      risorsa: newRisorsa,
    }
  },
  methods: {
    ...mapMutations('appuntimm', ['showGallery']),
    showImage() {
      this.showGallery({lista: this.appunto.files, index: 0})
    }
  },
  mounted() {
    this.risorsa = this.appunto.files[0]
  }
}
</script>
