<template>
    <div class="text-align-center">
        <div>Aggiungi Foto</div>
        <v-row>
            <v-col :cols="12" >
                <div class="align-center" style="overflow:hidden; margin:auto; padding: 4px; border: 0px solid silver;height:250px;width:300px">
                    <img :src="imgUrl" ref="camimg" style="max-width:90%" />
                </div>
            </v-col>
        </v-row>


        <v-row>
            <v-col :cols="12" class="text-align-center">
                <v-btn class="elevation-0" small>
                    <v-icon>mdi-camera</v-icon>
                    <input
                            class="camera"
                            ref="inputcam" @change="onImgLoaded" type="file" accept="image/*" capture="user" />
                            Scatta
                </v-btn>

                <v-btn class="elevation-0" small>
                    <v-icon>mdi-folder-image</v-icon>
                    <input
                            class="upload"
                            ref="inputfile" @change="onImgUploaded" type="file" accept="image/*"  />
                    Carica
                </v-btn>
            </v-col>
        </v-row>

    </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    created () {
      this.$emit('snap-photo', null)
    },
    data () {
      return {
        file: null,
        imgUrl: null
      }
    },
    computed: {

    },
    methods: {
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
