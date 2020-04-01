<template>
    <div>
        <v-row>
            <v-col cols="12" sm="12">
                <v-card style="min-height:200px" flat>

                    <v-container fluid>
                        <v-row>
                            <v-col
                                    v-for="(icon, idx) in icons"
                                    :key="idx"
                                    class="d-flex child-flex"
                                    cols="4"
                            >
                                <v-card flat tile class="d-flex">

                                    <img src="null" ref="icon">
                                    <v-img
                                            v-if="false"
                                            _ref="icon"
                                            :src="`https://picsum.photos/10/6?image=15`"
                                            :lazy-src="`https://picsum.photos/10/6?image=15`"
                                            aspect-ratio="1"
                                            class="grey lighten-2"
                                    >
                                        <template v-slot:placeholder>
                                            <v-row
                                                    class="fill-height ma-0"
                                                    align="center"
                                                    justify="center"
                                            >
                                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
  import {previewFile, appDir} from '../../assets/filesystem'
  export default {
    components: {},
    watch: {
      'icons' () {
        for(let icon in this.icons) {
          var img = this.$refs[icon]
          console.dir(img)
          const imgName = `${appDir}/${icon}`
          previewFile(imgName, img)
        }
      }
    },
    props: ['icons']
  }
</script>
