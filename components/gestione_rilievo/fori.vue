<template>
  <div style="height: 100%;">
    <v-card style="height: 100%;">
      <v-card-text :style="{ height: 'calc(100% - 36px)' }">
        <!-- <v-btn rounded color="primary" dark small @click="aggiungiNuovaPosizione()" class="ma-2">
          posizione
          <v-icon>mdi-plus</v-icon>
        </v-btn> -->

        <!-- Visualizza l'elenco delle posizioni -->
        <v-card v-for="(pos, i) in posizioni" :key="i" class="mb-2">
          <v-toolbar color="teal" dark dense>
            <v-toolbar-title>{{ pos.descrizione }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
          </v-toolbar>

          <!-- PER OGNI POSIZIONE ELENCA GLI ARTICOLI -->
          <v-list>
            <v-list-item v-for="(art, i) in getArticoliDellaPosizione(pos._id)" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{ i }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-icon>
                <v-btn icon @click="apriWM(art._id)"> <v-icon>mdi-pencil</v-icon></v-btn>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card>
      </v-card-text>
      <v-card-actions class="py-0 d-flex justify-center">
        <v-btn text outlined color="indigo" @click="aggiungiNuovaPosizione()"><v-icon>mdi-plus</v-icon>AGGIUNGI POSIZIONE</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="ui.visualizzaWizardPosizione" max-width="400px">
      <wizardPosizione @onExit="chiudiWizardPosizione" @onSave="salvaPosizione()" :lavoroID="record.lavoroID" />
    </v-dialog>

    <v-dialog v-model="visualizzaWizardMisure" :fullscreen="$vuetify.breakpoint.xsOnly" max-width="400px">
      <wizardMisure :articoloDaEditareID="articoloDaEditareID" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter } from 'nuxt-property-decorator'
import wizardPosizione from '@/components/gestione_rilievo/wizardPosizione.vue'
import wizardMisure from '@/components/gestione_rilievo/wizardMisure.vue'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { Posizione } from '@/store/posizioneModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato } from '@/store/articoloModel'

@Component({ components: { wizardPosizione, wizardMisure }, name: 'Fori' })
export default class RilievoFori extends Vue {
  @Getter('posizioneModule/posizioni') posizioni!: Posizione[]
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  visualizzaWizardMisure = false
  articoloDaEditareID: string = ''

  apriWM(artID: string) {
    this.visualizzaWizardMisure = true
    this.articoloDaEditareID = artID
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

  getArticoliDellaPosizione(posID: string): ArticoloSpecificoConfigurato[] {
    if (!this.record.listaArticoliSpec) {
      return []
    }
    return this.record.listaArticoliSpec.filter(art => art.rifPosID === posID)
  }

  // mounted(){
  //   this.$store.dispatch('posizioneModule/loadPosizioni', this.record.lavoroID, {root: true})
  // }
}
</script>