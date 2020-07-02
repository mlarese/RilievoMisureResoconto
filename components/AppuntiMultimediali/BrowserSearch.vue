<template>
  <v-card class="elevation-0">
    <div class="d-flex ">

      <v-text-field
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
  name: "BrowserSearch"
}
</script>
