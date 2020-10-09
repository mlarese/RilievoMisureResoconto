<template>
  <div>

    <v-card class="overflow-hidden viewer fill-height" :elevation="0">
      <!-- FILTRO -->
      <v-row dense>
        <v-col cols="12">
          <BrowserSearch />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <BrowserView ref="BrowserView" />
        </v-col>
      </v-row>

    </v-card>

    <v-footer color="white" app inset v-if="$vuetify.breakpoint.xs">
      <v-row dense >
        <v-col cols="12" class="pb-0">
          <BrowserInput />
        </v-col>
      </v-row>
    </v-footer>

    <v-row dense v-if="!$vuetify.breakpoint.xs" >
      <v-col cols="12" class="pb-0">
        <BrowserInput />
      </v-col>
    </v-row>

 <GalleryBox />

 <v-dialog
      v-if="isBrowserLoadImagesVisible"
      :value="isBrowserLoadImagesVisible"
      persistent
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="800px"
    >
      <BrowserLoadImages />
    </v-dialog>
  </div>
</template>

<script>
import GalleryBox from '../Risorse/GalleryBox'
import BrowserLoadImages from '~/components/AppuntiMultimediali/BrowserLoadImages'
import BrowserCompleteInput from '~/components/AppuntiMultimediali/BrowserCompleteInput'
import BrowserSearch from '~/components/AppuntiMultimediali/BrowserSearch'
import BrowserInput from '~/components/AppuntiMultimediali/BrowserInput'
import BrowserView from '~/components/AppuntiMultimediali/BrowserView'
import { appuntimm } from './browsermx'

  export default {
    mixins: [appuntimm],
    props: ['job'],
    components: {BrowserSearch, BrowserInput, BrowserView, BrowserCompleteInput, GalleryBox, BrowserLoadImages},
    mounted () {
    },
    created() {
      this.setLavoroCorrente(this.job)
      this.getStrutturaDiClassificazione()
    }
  };
</script>
