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

          <image-uploader
            :preview="false"
            capture="environment"
            :debug="0"
            accept="video/*, image/*"
            :quality="0.7"
            :maxWidth="200"
            :autoRotate="true"
            outputFormat="blob"
            @input="setImage"
          >
            <label for="fileInput" slot="upload-label" class="photo-camera-label">
              <figure>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="64" viewBox="0 0 32 32">
                  <path
                    class="path1"
                    d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
                  ></path>
                </svg>
              </figure>
            </label>
          </image-uploader>

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
      setImage (file) {
        this.$emit('snap-photo', file)
        this.$refs.imageUploader.createImage(file)
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
    .photo-camera-label{
      cursor: pointer;
    }
    #fileInput {
      display: none;
    }
</style>
