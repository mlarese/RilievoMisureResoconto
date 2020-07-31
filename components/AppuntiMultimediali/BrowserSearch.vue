<template>
  <v-card class="elevation-0">

    <portal to="xs-bar-right">
      <v-btn @click="gotoSearch"  icon color="primary" class="">
        <v-icon medium>search</v-icon>
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
