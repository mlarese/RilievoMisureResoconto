<template>
  <v-card class="elevation-0">

    <portal to="app-bar-right">
      <v-btn fab @click="gotoSearch" text class="pa-0 ma-0" small :width="30">
        <v-icon medium>search</v-icon>
      </v-btn>
    </portal>

    <div class="d-flex ">
      <v-text-field
        ref="inputRef"
        outlined
        dense
        hide-details
        placeholder="Cerca appunti multimediali..."
        append-icon="search"
        background-color="white"
        v-model="ui.filter"
      />

    </div>
  </v-card>
</template>

<script>
import {appuntimm} from './browsermx'

export default {
  mixins: [appuntimm],
  name: "BrowserSearch",
  methods: {
    gotoSearch () {
      this.$vuetify.goTo(0)
      this.$nextTick(() => {  this.$refs.inputRef.$refs.input.focus() })
    }
  }
}
</script>
