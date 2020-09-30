<template>
  <v-stepper v-model="stepIndex" style="height: 100%">
    <!-- Selezione posizione -->
    <v-stepper-content step="0" style="height: 100%;">
      <v-card flat :style="{ height: 'calc(100vh - 80px)' }">
        <v-card-title> Selezionare la posizione </v-card-title>

        <v-card-text v-if="posizioni && posizioni.length > 0">
          <!-- Visualizza l'elenco delle posizioni -->
          <v-list>
            <v-list-item-group v-model="posizioneSelezionata" color="primary">
              <template v-for="(pos, i) in posizioni">
                <v-list-item :key="i" :value="pos">
                  <v-list-item-content>
                    <v-list-item-title v-text="pos.descrizione"></v-list-item-title>
                  </v-list-item-content>

                  <v-spacer></v-spacer>

                  <v-icon v-if="posizioneSelezionata._id == pos._id">mdi-check</v-icon>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-card-text v-else>
          <p class="text-center">Non hai inserito alcuna posizione.</p>
          <p class="text-center">Aggiungine una</p>
        </v-card-text>

        <v-card-actions class="py-0 d-flex justify-center">
          <v-btn text outlined color="indigo"><v-icon>mdi-plus</v-icon>AGGIUNGI NUOVA POSIZIONE</v-btn>
        </v-card-actions>
      </v-card>

      <v-card-actions flat class="pa-0 ma-0">
        <v-btn text outlined color="green" @click="exit">ANNULA</v-btn>
        <v-spacer></v-spacer>
        <v-btn text outlined color="green" @click="nextStep">AVANTI<v-icon>mdi-chevron-right</v-icon></v-btn>
      </v-card-actions>
    </v-stepper-content>

    <!-- Selezione articoli -->
    <v-stepper-content step="1">
      <v-card flat :style="{ height: 'calc(100vh - 80px)' }">
        <v-card-title>Selezionare gli articoli per:</v-card-title>
        <v-subheader>{{ posizioneSelezionata.descrizione }}</v-subheader>
        <v-card-text>
          <!-- Visualizza gli articoli delle schede -->

          <v-list two-line>
            <v-list-item-group v-model="articoliSelezionati" multiple color="primary">
              <template v-for="(artGen, index) in listaArticoliGen">
                <v-list-item :key="artGen._id" :value="artGen">
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title v-text="artGen.descrizione"></v-list-item-title>

                      <!-- <v-list-item-subtitle class="text--primary" v-text="item.headline"></v-list-item-subtitle>

                      <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle> -->
                    </v-list-item-content>

                    <v-list-item-action>
                      <!-- <v-list-item-action-text v-text="item.action"></v-list-item-action-text> -->

                      <v-icon v-if="!active">
                        mdi-checkbox-blank-circle-outline
                      </v-icon>

                      <v-icon v-else>
                        mdi-checkbox-marked-circle-outline
                      </v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item>

                <v-divider v-if="index < articoliSelezionati.length - 1" :key="index"></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-card-actions class="py-0 d-flex justify-center">
          <v-btn text outlined color="indigo"><v-icon>mdi-plus</v-icon>AGGIUNGI NUOVA SCHEDA</v-btn>
        </v-card-actions>
      </v-card>

      <v-card-actions flat class="pa-0 ma-0">
        <v-btn text outlined color="green" @click="backStep"><v-icon>mdi-chevron-left</v-icon>INDIETRO</v-btn>
        <v-spacer></v-spacer>
        <v-btn text outlined color="green" @click="nextStep">AVANTI<v-icon>mdi-chevron-right</v-icon></v-btn>
      </v-card-actions>
    </v-stepper-content>

    <!-- Riepilogo -->
    <v-stepper-content step="2">
      <v-card flat :style="{ height: 'calc(100vh - 80px)' }">
        <v-card-title>Riepilogo posizione</v-card-title>

        <v-card-text class="px-0">
          <v-list two-line>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ posizioneSelezionata.posizione }}</v-list-item-title>
                <v-list-item-subtitle>Posizione</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ posizioneSelezionata.descrizione }}</v-list-item-title>
                <v-list-item-subtitle>Descrizione</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-card-subtitle>Articoli scelti:</v-card-subtitle>

            <v-list-item v-for="(art, i) in articoliSelezionati" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{ art.descrizione }}</v-list-item-title>
                <v-list-item-subtitle>...altre info</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions flat class="pa-0 ma-0">
          <v-btn text outlined color="green" @click="backStep"><v-icon>mdi-chevron-left</v-icon>INDIETRO</v-btn>
          <v-spacer></v-spacer>
          <v-btn text outlined color="green" @click="salvaPosizione">SALVA</v-btn>
        </v-card-actions>
      </v-card>
    </v-stepper-content>
  </v-stepper>
</template>


<script lang="ts">
import { Vue, Component, namespace, State, Getter } from 'nuxt-property-decorator'
import { v4 as uuidv4 } from 'uuid'
import wizardPosizione from '@/components/gestione_rilievo/wizardPosizione.vue'

import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { Posizione } from '@/store/posizioneModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato } from '@/store/articoloModel'

@Component({ components: { wizardPosizione }, name: 'Fori' })
export default class RilievoFori extends Vue {
  @Getter('posizioneModule/posizioni') posizioni!: Posizione[]

  articoliSelezionati = new Array<ArticoloGeneraleConfigurato>()
  posizioneSelezionata = new Posizione()
  stepIndex = 0

  nextStep() {
    this.stepIndex++
  }

  backStep() {
    this.stepIndex--
  }

  exit(){
    this.ui.visualizzaWizardRilievo = false
  }

  async salvaPosizione() {
    // Crea un nuovo articolo specifico per ogni articolo generico
    // In questa fase non sarà ancora configurato

    if (!this.record.listaArticoliSpec) {
      this.record.listaArticoliSpec = new Array<ArticoloSpecificoConfigurato>()
    }

    for (const artGen of this.articoliSelezionati) {
      let articoloSpec = new ArticoloSpecificoConfigurato()
      articoloSpec._id = uuidv4()
      articoloSpec.rifPosID = this.posizioneSelezionata._id
      articoloSpec.rifSchedaID = artGen._id
      this.record.listaArticoliSpec.push(articoloSpec)
    }

    await this.$store.dispatch('rilievoModule/salva', undefined, { root: true })
  }

  get listaArticoliGen() {
    return this.record.listaArticoliGen
  }

 @State(state => state.rilievoModule.record) record !: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI
}
</script>