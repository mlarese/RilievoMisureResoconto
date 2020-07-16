<template>
    <v-card :elevation="0">
      <v-row>
        <v-col class="pa-5" :cols="12" >

            <PhotoCamera @snap-photo="onSnapPhoto" @files-list-change="onFilesListChange" />

        </v-col>
      </v-row>

      <v-row>
        <v-col class="pa-5" :cols="12" >

          <BrowserCompleteInput />

        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12" class="pa-2">
              <span class="float-right">
                <v-btn color="blue darken-1" text @click="annulla()">Annulla</v-btn>
                <v-btn :disabled="$files.length == 0 && photo === null" color="blue darken-1" text @click="salva()">Salva</v-btn>
              </span>
        </v-col>
      </v-row>
    </v-card>

</template>

<script>
import {appuntimm} from './browsermx'
import PhotoCamera from "~/components/Photo/PhotoCamera"
import BrowserCompleteInput from "./BrowserCompleteInputLite"
import {mapState, mapGetters} from "vuex";

export default {
  mixins: [appuntimm],
  components: {PhotoCamera, BrowserCompleteInput},
  data () {
    return {
      photo: null,
      note: null,
      description: null
    }
  },
  computed: {
    ...mapGetters('photocamera', ['isPhotocamera', 'isPhotos'])
  },
  methods: {
    onAddImage () {
      let {description, note, photo} = this
      this.addImage({photo, description, note})
    },
    onFilesListChange (files) {
      this.setFiles(files)
    },
    onSnapPhoto (photo) {
      this.photo = photo
    },
    annulla () {
      this.cancelPhotocamera()
    },
    salva () {
      if(this.isPhotocamera) this.addImage(this.photo).then(() => this.cancelPhotocamera())
      else this.addSetImage().then(() => this.cancelPhotocamera())
    }
  }
}
</script>
