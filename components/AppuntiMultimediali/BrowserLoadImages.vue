<template>
  <v-card ref="mainCard" :height="$vuetify.breakpoint.xsOnly ? '100vh' : '80vh'">
    <v-toolbar ref="mainCard_toolbar" dense dark color="primary" elevation="0">
      <v-btn icon @click="annulla()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- Scatta foto -->
        <v-btn dark icon>
          <v-icon>mdi-camera-iris</v-icon>
          <input
            type="file"
            accept="image/*"
            capture="camera"
            @change="filesChange($event.target.files)"
            multiple="true"
            class="input-file"
          />
        </v-btn>

        <!-- Scatta video -->
        <v-btn dark icon>
          <v-icon>mdi-video-outline</v-icon>
          <input
            type="file"
            accept="video/*"
            capture="camera"
            @change="filesChange($event.target.files)"
            multiple="true"
            class="input-file"
          />
        </v-btn>

        <!-- Carica foto da gallery -->
        <v-btn dark icon>
          <v-icon>mdi-image</v-icon>
          <input
            type="file"
            accept="image/*"
            @change="filesChange($event.target.files)"
            multiple="true"
            class="input-file"
          />
        </v-btn>

        <!-- Carica file -->
        <v-btn dark icon>
          <v-icon>mdi-paperclip</v-icon>
          <input
            type="file"
            accept="*/*"
            capture="filesystem"
            @change="filesChange($event.target.files)"
            multiple="true"
            class="input-file"
          />
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- calcola l'altezza senza la toolbar e card-actions -->
    <v-row style="height: calc(100% - 48px - 52px)" class="pa-0 ma-0">
      <v-col cols="12" style="height: calc(100% - 120px)" class="py-0">
        <ResourceGallery ref="ResourceGallery" :listaRisorse="ui.listaRisorse" :editable="true" />
      </v-col>
      <v-col cols="12" style="height: 110px" class="py-0 pt-2">
        <BrowserCompleteInputLite />
      </v-col>
    </v-row>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="ui.listaRisorse.length == 0"
        :loading="isSaving"
        color="blue darken-1"
        text
        @click="salva()"
      >Salva</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ResourceGallery from '../Risorse/ResourceGallery'
import { appuntimm } from './browsermx'
import BrowserCompleteInputLite from './BrowserCompleteInputLite'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  mixins: [appuntimm],
  components: {
    BrowserCompleteInputLite,
    ResourceGallery
  },
  data() {
    return {
      isSaving: false,
      isLoadingRes: false
    }
  },
  methods: {
    ...mapActions('dm_resources', ['getRisorsaFromBlob']),
    filesChange(selectedFiles) {
      Array.prototype.forEach.call(selectedFiles, (file) => {
        this.getRisorsaFromBlob(file).then((risorsa) => {
          this.ui.listaRisorse.push(risorsa)
          this.$refs.ResourceGallery.setImageIndex(
            this.ui.listaRisorse.length - 1
          )
        })
      })
    },
    // onAddImage() {
    //   let { description, note, photo } = this
    //   this.addImage({ photo, description, note })
    // },
    // onFilesListChange(files) {
    //   this.setFiles(files)
    // },
    // onSnapPhoto(photo) {
    //   this.photo = photo
    // },
    annulla() {
      this.cancelPhotocamera()
    },
    salva() {
      this.isSaving = true
      this.addSetImage().then(() => {
        this.cancelPhotocamera()
        this.isSaving = false
      })
    }
    // getHeightMedia() {
    //   let offset = -10
    //   if (this.$el) offset = this.$el.offsetTop
    //   if (this.$vuetify.breakpoint.xsOnly) {
    //     return this.$vuetify.breakpoint.height - 280 + offset
    //   } else {
    //     return this.$vuetify.breakpoint.height - 500 + offset
    //   }
    // },
    // getWidthMedia() {
    //   if (this.$el) {
    //     return this.$el.clientWidth
    //   }
    // }
  }
}
</script>

<style>
.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
}
</style>
