<template>
  <v-card>
    <v-toolbar dense dark color="primary" elevation="0">
      <v-btn icon @click="annulla()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <!-- <v-btn text class="pl-0" @click="annulla()">ANNULLA</v-btn> -->
      <!-- <v-toolbar-title>Settings</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <!-- <v-btn dark icon @click="editFile()">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn dark icon @click="removeFile()">
          <v-icon>mdi-delete</v-icon>
        </v-btn>-->

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
            accept="application/*"
            @change="filesChange($event.target.files)"
            multiple="true"
            class="input-file"
          />
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content class="pa-0 pb-1">
      <ResourceBig
        :key="indexRisorsa"
        :risorsa="indexRisorsa > -1 ? ui.listaRisorse[indexRisorsa] : null"
        :style="{height: getHeightMedia() + 'px'}"
        :maxHeight="getHeightMedia()"
        :maxWidth="(getWidthMedia()) ? getWidthMedia(): 200"
        v-touch:swipe.left="incrementImageIndex"
        v-touch:swipe.right="decrementImageIndex"
        v-on:onRemoveCurrentFile="removeFile"
      />

      <div
        class="d-flex align-center justify-start px-1 pt-1"
        :style="{'max-width': getWidthMedia + 'px', 'overflow-x': 'scroll'}"
      >
        <div v-for="(ris, i) in ui.listaRisorse" :key="i" @click="setImageIndex(i)">
          <ResourceAvatar :risorsa="ris" class="pr-1" />
        </div>
      </div>
      <v-container>
        <BrowserCompleteInputLite class="px-1" />
        <span class="float-right">
          <v-btn
            :disabled="ui.listaRisorse.length == 0"
            color="blue darken-1"
            text
            @click="salva()"
          >Salva</v-btn>
        </span>
      </v-container>
    </v-content>
  </v-card>
</template>

<style>
.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
}
</style>

<script>
import ResourceAvatar from './ResourceAvatar'
import ResourceBig from './ResourceBig'
import { appuntimm } from './browsermx'
import PhotoCamera from '~/components/Photo/PhotoCamera'
import BrowserCompleteInputLite from './BrowserCompleteInputLite'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  mixins: [appuntimm],
  components: {
    PhotoCamera,
    BrowserCompleteInputLite,
    ResourceAvatar,
    ResourceBig
  },
  data() {
    return {
      indexRisorsa: 0
    }
  },
  computed: {
    ...mapGetters('photocamera', ['isPhotocamera', 'isPhotos'])
  },
  methods: {
    ...mapActions('dm_resources', ['getUrlFromBlob']),
    filesChange(selectedFiles) {
      Array.prototype.forEach.call(selectedFiles, (file) => {
        this.getUrlFromBlob(file).then((risorsa) => {
          this.ui.listaRisorse.push(risorsa)
        })
      })
      this.setImageIndex(this.ui.listaRisorse.length)
    },
    setImageIndex(indx) {
      this.indexRisorsa = indx
    },
    incrementImageIndex() {
      if (this.indexRisorsa < this.ui.listaRisorse.length - 1)
        this.indexRisorsa++
    },
    decrementImageIndex() {
      if (this.indexRisorsa > 0) this.indexRisorsa--
    },
    removeFile() {
      this.ui.listaRisorse.splice(this.indexRisorsa, 1)
      this.setImageIndex(this.ui.listaRisorse.length - 1)
    },
    onAddImage() {
      let { description, note, photo } = this
      this.addImage({ photo, description, note })
    },
    onFilesListChange(files) {
      this.setFiles(files)
    },
    onSnapPhoto(photo) {
      this.photo = photo
    },
    annulla() {
      this.cancelPhotocamera()
    },
    salva() {
      this.addSetImage().then(() => this.cancelPhotocamera())
    },
    getHeightMedia() {
      let offset = -10
      if (this.$el) offset = this.$el.offsetTop
      if (this.$vuetify.breakpoint.xsOnly) {
        return this.$vuetify.breakpoint.height - 280 + offset
      } else {
        return this.$vuetify.breakpoint.height - 500 + offset
      }
    },
    getWidthMedia() {
      if (this.$el) {
        return this.$el.clientWidth
      }
    }
  }
}
</script>
