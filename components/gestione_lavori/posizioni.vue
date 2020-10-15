<template>
  <div style="height: 100%;">
    <v-card flat :style="`height:${getHeight}px`">
      <v-card-title>Posizioni di installazione </v-card-title>
      <v-card-text :style="{ height: 'calc(100% - 36px)', 'overflow-y': 'auto' }" v-if="posizioni && posizioni.length > 0">
        <!-- Visualizza l'elenco delle posizioni -->
        <v-card v-for="(pos, i) in posizioni" :key="i" class="mb-2">
          <v-toolbar color="#e4effa" dense flat>
            <v-toolbar-title>{{ pos.posizione }} - {{ pos.descrizione }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="openMediaPos(pos._id)"><v-icon>mdi-folder-multiple-image</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
          </v-toolbar>         
        </v-card>
      </v-card-text>
      <v-card-text v-else>
        <v-container class="fill-height d-flex flex-column align-center justify-center">
          <v-img :src="require('../../assets/images/posizione-empty-list.png')" contain max-width="50%" max-height="50%"></v-img>
          <p class="title text-center">Nussuna posizione presente</p>
          <p class="caption font-weight-light text-center" style="margin-top: -20px;">
            Inizia cliccando sul pulsante (+) qui in basso
          </p>
        </v-container>
      </v-card-text>
    </v-card>

    <v-dialog v-model="visualizzaMedia" :fullscreen="$vuetify.breakpoint.xsOnly" max-width="700px">
      <v-card>
        <v-toolbar color="primary" dense dark flat>
          <v-btn icon class="ml-1" @click="exitMultimedia()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <media class="overflow-hidden" :job="rif_x_Media" :key="rif_x_Media.pos_id" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter } from 'nuxt-property-decorator'
import media from '@/components/AppuntiMultimediali/Browser.vue'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { Posizione } from '@/store/posizioneModule'

@Component({ components: { media }, name: 'Fori' })
export default class RilievoFori extends Vue {
  @Getter('posizioneModule/posizioni') posizioni!: Posizione[]
  @State(state => state.gestione_lavori.$record) record!: RilievoRecord

  visualizzaMedia = false
  rif_x_Media = {}

  openMediaPos(pos_id: string) {
    this.rif_x_Media = { job_id: this.record._id, pos_id }
    this.visualizzaMedia = true
  }
  exitMultimedia() {
    this.visualizzaMedia = false
  }
  
  get getHeight() {
    let offset = -10
    if (this.$vuetify.breakpoint.xsOnly) {
      return this.$vuetify.breakpoint.height - 120 //+ offset
    } else {
      return this.$vuetify.breakpoint.height - 300 //+ offset
    }
  }

  get getHeightDialog() {
    let offset = -10
    if (this.$vuetify.breakpoint.xsOnly) {
      return this.$vuetify.breakpoint.height
    } else {
      if (this.$vuetify.breakpoint.height > 600) {
        return 600
      } else {
        return this.$vuetify.breakpoint.height
      }
    }
  }
}
</script>