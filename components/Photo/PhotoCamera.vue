<template>
    <div class="text-align-center">
        <v-row >
          <v-col columns="12" class="pa-5">
            <vue-upload-multiple-image
              ref="imageUploader"
              @before-remove="beforeRemove"
              @upload-success="uploadSuccess"
              @edit-image="editImage"
              dragText=" "
              browseText="Scegli File"
              label="immagini"
              dropText="Rilascia file"
              primaryText="Inserisci Immagine"
              popupText="Immagini"
              :maxImage="34"
              markIsPrimaryText="Seleziona Immagine"
            />
          </v-col>
        </v-row>

      <v-row class="py-0">
        <v-col :cols="12" class="py-0 text-align-center">
          <v-btn class="elevation-0" small >
            <v-icon>mdi-camera</v-icon>
            <input
              style=" cursor:pointer"
              class="camera"
              ref="inputcam" @change="onImgLoaded" type="file" accept="image/*" capture="user" /> <span class="ml-1">Scatta</span>
          </v-btn>

        </v-col>
      </v-row>

    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import VueUploadMultipleImage from '../General/UploadMultipleImage'

  export default {
    watch: {
      'ui.tabsCameraPhoto' () {
        this.imgUrl = null
        this.$emit('snap-photo', null)
        this.$emit('files-list-change', [])
      }
    },
    created () {
      this.$emit('snap-photo', null)
    },
    computed: {
      ...mapState('photocamera', ['ui'])
    },
    data () {
      return {
        pictures: [],
        file: null,
        imgUrl: null,
        files: []
      }
    },
    components: {
      VueUploadMultipleImage
    },
    methods: {
      reduceFiles (fileList) {
        let ret = []

        for(let i = 0; i < fileList.length; i++)
          ret.push(fileList[i]['file'])
        return ret
      },
      editImage(formData, index, fileList) {
        this.files = this.reduceFiles(fileList)
        this.$emit('files-list-change', this.files)
      },
      uploadSuccess(formData, index, fileList) {
        this.files = this.reduceFiles(fileList)
        this.$emit('files-list-change', this.files)
        this.$refs.imageUploader.changeHighlightLast()
      },
      beforeRemove (index, done, fileList) {
          done()
          this.files = this.reduceFiles(fileList)
          this.$emit('files-list-change', this.files)
      },
      displayAsImage(file, ref) {
        this.imgUrl = URL.createObjectURL(file)
        let img = this.$refs[ref]
        img.onload = function() {
          URL.revokeObjectURL(this.imgUrl);
        };
        img.src = this.imgUrl;
      },
      onImgLoaded (event) {
        this.file = event.target.files[0]
        if(!this.file) return
        this.displayAsImage(this.file, 'inputcam')
        this.$emit('snap-photo', this.file)
        this.$refs.imageUploader.createImage(this.file)
      },
      onImgUploaded (event) {
        this.file = event.target.files[0]
        if(!this.file) return
        this.displayAsImage(this.file, 'inputfile')
        this.$emit('snap-photo', this.file)
      }

    }
  }
</script>

<style>
    input.camera {
        position: absolute;
        right: -10px;
        top: -4px;
        width:130px;
        font-family: Arial;
        font-size: 118px;
        margin: 0px;
        padding: 0px;
        cursor: pointer;
        opacity: 0;
        height: 25px;
    }
    input.upload {
        position: absolute;
        left: -15px;
        top: 0px;
        width:130px;
        font-family: Arial;
        font-size: 118px;
        margin: 0px;
        padding: 0px;
        cursor: pointer;
        opacity: 0;
        height: 25px;
    }
</style>
