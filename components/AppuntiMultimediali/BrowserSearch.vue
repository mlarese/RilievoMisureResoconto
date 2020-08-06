<template>
  <v-card class="elevation-0">

    <portal to="xs-bar-right">
      <v-btn @click="gotoSearch"  icon color="primary" class="">
        <v-icon medium>mdi-magnify</v-icon>
      </v-btn>
    </portal>
    <div class="d-flex ">
      <v-text-field
        ref="inputRef"
        outlined
        clearable
        dense
        hide-details
        placeholder="Cerca appunti multimediali..."
        append-icon="mdi-magnify"
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
