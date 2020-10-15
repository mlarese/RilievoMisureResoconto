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
          <p v-if="getArticoliDellaPosizione(pos._id).length == 0" class="pa-2">Nessun articolo inserito in questa posizione</p>

          <!-- PER OGNI POSIZIONE ELENCA GLI ARTICOLI -->
          <v-list v-else>
            <v-list-item v-for="(art, i) in getArticoliDellaPosizione(pos._id)" :key="i">
              <v-list-item-icon v-if="art.listaPropValued.length == 0">
                <v-icon color="red">mdi-alert</v-icon>
              </v-list-item-icon>

              <v-list-item-icon v-else>
                <v-icon color="green">mdi-checkbox-marked-circle-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ getArtGen(art.rifSchedaID).descrizione }}</v-list-item-title>
                <v-list-item-subtitle>{{ getArtGen(art.rifSchedaID).subDescrizione }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon>
                <v-btn icon @click="apriWM(art._id)"> <v-icon>mdi-pencil</v-icon></v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
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
      <v-btn absolute rounded dark bottom right color="primary" @click="aggiungiNuovaPosizione"> <v-icon>mdi-plus</v-icon> AGGIUNGI POSIZIONE </v-btn>
    </v-card>

    <v-dialog v-model="ui.visualizzaWizardPosizione" max-width="400px">
      <wizardPosizione @onExit="chiudiWizardPosizione" @onSave="salvaPosizione()" :lavoroID="record.lavoroID" />
    </v-dialog>

    <v-dialog v-model="visualizzaWizardMisure" :fullscreen="$vuetify.breakpoint.xsOnly" max-width="400px">
      <wizardMisure v-if="visualizzaWizardMisure" :height="getHeightDialog" :articoloDaEditareID="articoloDaEditareID" @onExit="exitWizardMisure" />
    </v-dialog>

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
import wizardPosizione from '@/components/gestione_rilievo/wizardPosizione.vue'
import wizardMisure from '@/components/gestione_rilievo/wizardMisure.vue'
import media from '@/components/AppuntiMultimediali/Browser.vue'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { Posizione } from '@/store/posizioneModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato } from '@/store/articoloModel'

@Component({ components: { wizardPosizione, wizardMisure, media }, name: 'Fori' })
export default class RilievoFori extends Vue {
  @Getter('posizioneModule/posizioni') posizioni!: Posizione[]
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  visualizzaWizardMisure = false
  articoloDaEditareID: string = ''

  visualizzaMedia = false
  rif_x_Media = {}

  openMediaPos(pos_id: string) {
    this.rif_x_Media = { job_id: this.record.lavoroID, pos_id }
    this.visualizzaMedia = true
  }
  exitMultimedia() {
    this.visualizzaMedia = false
  }

  apriWM(artID: string) {
    this.visualizzaWizardMisure = true
    this.articoloDaEditareID = artID
  }
  exitWizardMisure() {
    this.visualizzaWizardMisure = false
  }

  aggiungiNuovaPosizione() {
    this.ui.visualizzaWizardPosizione = true
  }

  salvaPosizione() {
    this.ui.visualizzaWizardPosizione = false
  }

  chiudiWizardPosizione() {
    this.ui.visualizzaWizardPosizione = false
  }

  getArtGen(artGenID: string) {
    // let a = this.record.listaArticoliGen.find(a => (a._id = artGenID))
    // return a
    for (const art of this.record.listaArticoliGen) {
      if (art._id == artGenID) {
        return art
      }
    }
  }

  getArticoliDellaPosizione(posID: string): ArticoloSpecificoConfigurato[] {
    if (!this.record.listaArticoliSpec) {
      return []
    }
    let lista = this.record.listaArticoliSpec.filter(art => art.rifPosID === posID)
    return lista
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