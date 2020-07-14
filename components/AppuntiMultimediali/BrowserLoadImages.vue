<template>
    <v-card :elevation="0">
      <v-card-title  class="pb-0">Aggiungi foto</v-card-title>
      <v-row>
        <v-col class="pa-5" :cols="12" >

            <PhotoCamera @snap-photo="onSnapPhoto" />

        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12" class="pa-2">
              <span class="float-right">
                <v-btn color="blue darken-1" text @click="annulla()">Annulla</v-btn>
                <v-btn color="blue darken-1" text @click="salva()">Salva</v-btn>
              </span>
        </v-col>
      </v-row>
    </v-card>

</template>

<script>
import {appuntimm} from './browsermx'
import PhotoCamera from "~/components/Photo/PhotoCamera"

export default {
  mixins: [appuntimm],
  components: {PhotoCamera},
  data () {
    return {
      photo: null,
      note: null,
      description: null
    }
  },
  methods: {
    onAddImage () {
      let {description, note, photo} = this
      this.addImage({photo, description, note})
    },
    onSnapPhoto (photo) {
      this.photo = photo
    },
    annulla () {
      this.cancelPhotocamera()
    },
    salva () {
    }
  }
}
</script>
