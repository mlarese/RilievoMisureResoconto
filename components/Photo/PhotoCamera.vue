<template>
    <div style="text-align: center">
        <div>Aggiungi Foto</div>
        <v-layout rows wrap>
            <v-flex s12>
                <img :src="imgUrl"
                     ref="camimg"
                     style="border: 1px solid silver;max-width:250px;min-height:150px;min-width:250px"
                />
            </v-flex>
        </v-layout>

        <v-layout rows wrap>
            <v-flex>
                <v-btn class="elevation-0" small>
                    <v-icon>mdi-camera</v-icon>
                    <input
                            class="camera"
                            ref="inputcam" @change="onImgLoaded" type="file" accept="image/*" capture="user" />
                            Scatta
                </v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
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
    methods: {
      displayAsImage(file) {
        this.imgUrl = URL.createObjectURL(file)
        let img = this.$refs.camimg

        img.onload = function() {
          URL.revokeObjectURL(this.imgUrl);
        };

        img.src = this.imgUrl;
      },
      onImgLoaded (event) {
        this.file = event.target.files[0]
        this.displayAsImage(this.file)
        this.$emit('snap-photo', this.file)
      }

    }
  }
</script>

<style>
    input.camera {
        position: absolute;
        right: 0px;
        top: 0px;
        font-family: Arial;
        font-size: 118px;
        margin: 0px;
        padding: 0px;
        cursor: pointer;
        opacity: 0;
        height: 200px;
    }
</style>
