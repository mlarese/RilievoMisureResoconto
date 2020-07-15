<template>
    <div class="text-align-center">

      <v-tabs v-model="ui.tabsCameraPhoto" fixed-tabs>
        <v-tabs-slider color="accent"></v-tabs-slider>
        <v-tab><v-icon class="mr-3">camera</v-icon>Fotocamera</v-tab>
        <v-tab><v-icon  class="mr-3">image</v-icon>Foto</v-tab>

      </v-tabs>

      <v-tabs-items v-model="ui.tabsCameraPhoto">

      <v-tab-item  >
        <v-row v-if="ui.tabsCameraPhoto == 0">
            <v-col :cols="12" >
                <div class="mt-2 align-center" style="overflow:hidden; margin:auto; padding: 4px; border: 0px solid silver;height:250px;width:300px">
                    <img :src="imgUrl" ref="camimg" style="max-width:90%" />
                </div>
            </v-col>
        </v-row>
        <v-row >
            <v-col :cols="12" class="text-align-center">
                <v-btn class="elevation-0" small >
                    <v-icon>mdi-camera</v-icon>
                    <input
                            style=" cursor:pointer"
                            class="camera"
                            ref="inputcam" @change="onImgLoaded" type="file" accept="image/*" capture="user" /> <span class="ml-1">Scatta</span>
                </v-btn>

            </v-col>
        </v-row>
      </v-tab-item>

      <v-tab-item  >
        <v-row v-if="ui.tabsCameraPhoto == 1">
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
      </v-tab-item>
      </v-tabs-items>
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
