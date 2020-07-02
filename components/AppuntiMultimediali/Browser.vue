<template>
    <v-card class="overflow-hidden" :elevation="0" >

      <!-- FILTRO -->
      <v-row dense>
        <v-col cols="12">
          <BrowserSearch />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <BrowserView />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <BrowserInput />
        </v-col>
      </v-row>
    </v-card>

</template>

<script>
  import BrowserSearch from "~/components/AppuntiMultimediali/BrowserSearch"
  import BrowserInput from "~/components/AppuntiMultimediali/BrowserInput"
  import BrowserView from "~/components/AppuntiMultimediali/BrowserView"
  import {appuntimm} from './browsermx'

  export default {
    props: ['job'],
    mixins: [appuntimm],
    components: {BrowserSearch, BrowserInput, BrowserView},
    created() {
      this.setLavoroCorrente(this.job)
    }
  };
</script>
