<template>
    <div class="elevation-0" >
      <v-row>
          <v-col class="pa-0" :cols="12">
            <v-btn @click="setViewerStatusView" medium text class="float-right">
              <v-icon medium>close</v-icon>
            </v-btn>
          </v-col>
      </v-row>

      <v-row>
        <v-col class="pa-0" :cols="12" >
            <PhotoCamera @snap-photo="onSnapPhoto" />
        </v-col>
      </v-row>



      <v-footer color="white" app inset  >
        <v-row dense >
          <v-col cols="12" class="pb-0">
            <v-row class="px-5">
              <v-col :cols="12" class="py-0">
                <v-text-field  autofocus
                               dense
                               hide-details
                               outlined
                               placeholder="Scrivi una descrizione"
                               v-model="description"/>
              </v-col>

              <v-col :cols="12" class="py-0">
                <v-textarea
                  dense
                  class="mt-2"
                  hide-details
                  outlined
                  placeholder="Scrivi una nota"
                  v-model="note"/>

              </v-col>

            </v-row>

            <v-btn small color="success" @click="onAddImage" :disabled="!photo"   fab class="float-right my-2" :elevation="0">
              <v-icon small>send</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-footer>

    </div>

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
    }
  }
}
</script>
