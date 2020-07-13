<template>
  <div>

    <v-card :elevation="0" v-if="ui.viewerStatus === 'loadimage'" >
      <BrowserLoadImages />
    </v-card>

    <v-card v-if="ui.viewerStatus === 'view'" class="overflow-hidden viewer" :elevation="0">
      <!-- FILTRO -->
      <v-row dense>
        <v-col cols="12">
          <BrowserSearch />
        </v-col>
      </v-row>

      <v-row dense class="pb-5">
        <v-col cols="12">
          <BrowserView class="pb-5"/>
        </v-col>
      </v-row>

    </v-card>

    <v-footer color="white" app inset v-if="ui.viewerStatus === 'view' && $vuetify.breakpoint.xs">
      <v-row dense >
        <v-col cols="12" class="pb-0">
          <BrowserInput />
        </v-col>
      </v-row>
    </v-footer>

    <v-row dense v-if="ui.viewerStatus === 'view' && !$vuetify.breakpoint.xs" >
      <v-col cols="12" class="pb-0">
        <BrowserInput />
      </v-col>
    </v-row>

  </div>
</template>

<script>
import BrowserCompleteInput from '~/components/AppuntiMultimediali/BrowserCompleteInput'
import BrowserLoadImages from '~/components/AppuntiMultimediali/BrowserLoadImages'
import BrowserSearch from '~/components/AppuntiMultimediali/BrowserSearch'
import BrowserInput from '~/components/AppuntiMultimediali/BrowserInput'
import BrowserView from '~/components/AppuntiMultimediali/BrowserView'
import { appuntimm } from './browsermx'

  export default {
    mixins: [appuntimm],
    props: ['job'],
    components: {BrowserSearch, BrowserInput, BrowserView, BrowserLoadImages, BrowserCompleteInput},
    mounted () {
      this.$nextTick(() => {
        this.$vuetify.goTo('#end-appunti-browser-view', {offset: -1000})
      })
    },
    created() {
      this.setLavoroCorrente(this.job)
      this.getStrutturaDiClassificazione()
    }
  };
</script>
