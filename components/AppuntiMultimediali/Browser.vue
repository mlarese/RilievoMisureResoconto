<template>
  <div>
    <v-card v-if="ui.viewerStatus === 'loadimage'">
      <BrowserLoadImages />
    </v-card>
    <v-card v-if="ui.viewerStatus === 'view'" class="overflow-hidden viewer" :elevation="0">
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
  </div>
</template>

<script>
import BrowserLoadImages from '~/components/AppuntiMultimediali/BrowserLoadImages'
import BrowserSearch from '~/components/AppuntiMultimediali/BrowserSearch'
import BrowserInput from '~/components/AppuntiMultimediali/BrowserInput'
import BrowserView from '~/components/AppuntiMultimediali/BrowserView'
import { appuntimm } from './browsermx'

export default {
  props: ['job'],
  mixins: [appuntimm],
  components: { BrowserSearch, BrowserInput, BrowserView, BrowserLoadImages },
  created() {
    this.setLavoroCorrente(this.job)
  }
}
</script>
