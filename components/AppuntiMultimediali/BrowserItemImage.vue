<template>
  <div>
    <vue-easy-lightbox
      :visible="showPreviewImages"
      :imgs="(risorsa) ? risorsa.thumbnailUrl : null"
      @hide="handleHide()"
    ></vue-easy-lightbox>

    <v-dialog v-if="showPreviewVideo" :value="showPreviewVideo" max-width="800px" @click:outside="showPreviewVideo=false">
      <video :style="{width: '100%'}" controls>
        <source :src="risorsa.fileUrl" :type="risorsa.typeFile" />Your browser does not support HTML video.
      </video>
    </v-dialog>

    <div class="text-align-center overflow-x-hidden">
      <div class="text-align-center" style="height: 150px: max-height: 150px" @click="openFile()">
        <img width="100%s" :src="(risorsa) ? risorsa.thumbnailUrl : '/images/img-placeholder.png'" />
      </div>
      <div class="body-2 align-left mt-1">{{ appunto.data.EV_Descrizione }}</div>
    </div>
  </div>
</template>

<script>
import ResourceAvatar from './ResourceAvatar'
import { mapState, mapGetters, mapActions } from 'vuex'
import { appuntimm } from './browsermx'
let curDate = null

export default {
  mixins: [appuntimm],
  components: { ResourceAvatar },
  props: ['appunto'],
  data() {
    return {
      risorsa: this.appunto.files[0],
      showPreviewImages: false,
      showPreviewVideo: false,
      showPreviewPDF: false
    }
  },
  methods: {
    openFile() {
      if (this.risorsa.type === 'pdf') {
        this.showPreviewPDF = true
        window.open(this.risorsa.fileUrl)
      } else if (this.risorsa.type === 'video') {
        this.showPreviewVideo = true
      } else {
        this.showPreviewImages = true
      }
    },
    handleHide() {
      this.showPreviewImages = false
    }
  }
}
</script>
