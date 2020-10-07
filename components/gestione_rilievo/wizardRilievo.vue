<template>
  <div>
    <v-stepper v-model="stepIndex">
      <!-- Selezione posizione -->
      <v-stepper-content step="0" class="pa-0">
        <v-card :height="height">
          <v-card-title> Selezionare la posizione </v-card-title>

          <v-card-text :style="{ height: height - 112 + 'px', 'overflow-y': 'auto' }">
            <!-- Visualizza l'elenco delle posizioni -->
            <v-list v-if="posizioni && posizioni.length > 0">
              <v-list-item-group v-model="posizioneSelezionataID" color="primary">
                <template v-for="(pos, i) in posizioni">
                  <v-list-item :key="i" :value="pos._id" @click="onClick_ItemPos(pos._id)">
                    <v-list-item-content>
                      <v-list-item-title v-text="`${pos.posizione} - ${pos.descrizione}`"></v-list-item-title>
                    </v-list-item-content>

                    <v-spacer></v-spacer>

                    <v-icon v-if="pos && posizioneSelezionataID == pos._id">mdi-check</v-icon>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>

            <div v-else>
              <p class="text-center">Nessuna posizione trovata</p>
              <p class="text-center">Inizia cliccando sul pulsante (+) qui in basso</p>
            </div>
          </v-card-text>

          <v-footer absolute>
            <v-btn color="primary" dark absolute top fab @click="visualizzaNuovaPosizione = true" :style="{ left: '50%', transform: 'translateX(-50%)' }">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-card
              elevation="0"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '0px',
                transform: 'translateX(-50%)',
                'border-radius': '0 0 75px 75px',
                width: '75px',
                height: '38px',
                'background-color': 'white'
              }"
            >
            </v-card>
            <v-btn text color="gray" @click="exit">ANNULA</v-btn>
            <v-spacer></v-spacer>
            <v-btn text outlined color="green" @click="nextStep_posizioneSelezionata" :disabled="posizioneSelezionata._id == ''">
              AVANTI<v-icon>mdi-chevron-right</v-icon></v-btn
            >
          </v-footer>
        </v-card>
      </v-stepper-content>

      <!-- Selezione articoli -->
      <v-stepper-content step="1" class="pa-0">
        <v-card :height="height">
          <v-card-title>Indicare gli articoli per la posizione</v-card-title>
          <!-- <v-subheader>{{ posizioneSelezionata.posizione }} - {{ posizioneSelezionata.descrizione }}</v-subheader> -->

          <!-- Visualizza gli articoli delle schede -->
          <v-card-text :style="{ height: height - 112 + 'px', 'overflow-y': 'auto' }">
            <v-list two-line>
              <v-list-item-group v-model="articoliSelezionati" multiple color="primary">
                <template v-for="(artGen, iag) in record.listaArticoliGen">
                  <v-list-item :key="iag" :value="artGen">
                    <template v-slot:default="{ active }">
                      <v-list-item-content>
                        <v-list-item-title v-text="artGen.descrizione"></v-list-item-title>
                        <v-list-item-subtitle class="text--primary" v-text="artGen.subDescrizione"></v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-icon v-if="!active">
                          mdi-checkbox-blank-circle-outline
                        </v-icon>
                        <v-icon v-else>
                          mdi-checkbox-marked-circle-outline
                        </v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card-text>

          <v-footer absolute>
            <v-btn color="primary" dark absolute top fab :style="{ left: '50%', transform: 'translateX(-50%)' }">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-card
              elevation="0"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '0px',
                transform: 'translateX(-50%)',
                'border-radius': '0 0 75px 75px',
                width: '75px',
                height: '38px',
                'background-color': 'white'
              }"
            >
            </v-card>
            <v-btn text color="gray" @click="backStep"><v-icon>mdi-chevron-left</v-icon>INDIETRO</v-btn>
            <v-spacer></v-spacer>
            <v-btn text outlined color="green" @click="nextStep" :disabled="articoliSelezionati.length == 0">AVANTI<v-icon>mdi-chevron-right</v-icon></v-btn>
          </v-footer>
        </v-card>
      </v-stepper-content>

      <!-- Riepilogo -->
      <v-stepper-content step="2" class="pa-0">
        <v-card :height="height">
          <v-card-title>Riepilogo posizione</v-card-title>

          <v-card-text :style="{ height: height - 112 + 'px', 'overflow-y': 'auto' }">
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
                  <v-list-item-subtitle class="text--primary" v-text="art.subDescrizione"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-footer absolute>
            <v-btn text color="gray" @click="backStep"><v-icon>mdi-chevron-left</v-icon>INDIETRO</v-btn>
            <v-spacer></v-spacer>
            <v-btn text outlined color="green" @click="salvaPosizione">SALVA</v-btn>
          </v-footer>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="3" class="pa-0">
        <v-card :height="height">
          <v-card-title>E' ora di misurare...</v-card-title>
          <v-card-subtitle>
            Seleziona un articolo alla volta e segui le domande per la configurazione
          </v-card-subtitle>

          <v-card-text style="overflow-y: auto;">
            <v-list>
              <v-list-item v-for="(art, i) in getArticoliDellaPosizione(posizioneSelezionataID)" :key="i">
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
                  <v-icon @click="apriWM(art._id)">mdi-tape-measure</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-footer absolute>
            <v-btn color="primary" dark absolute top fab :style="{ left: '50%', transform: 'translateX(-50%)' }">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-card
              elevation="0"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '0px',
                transform: 'translateX(-50%)',
                'border-radius': '0 0 75px 75px',
                width: '75px',
                height: '38px',
                'background-color': 'white'
              }"
            >
            </v-card>

            <v-spacer></v-spacer>
            <v-btn text outlined color="green" @click="stepIndex = 0">Cambia foro</v-btn>
          </v-footer>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="4" class="pa-0">
        <wizardMisure v-if="articoloDaEditareID" :height="height" :articoloDaEditareID="articoloDaEditareID" @onExit="exitWizardMisure" />
      </v-stepper-content>
    </v-stepper>

    <v-dialog v-model="visualizzaNuovaPosizione" max-width="400px">
      <wizardPosizione @onExit="chiudiWizardPosizione" @onSave="salvaPosizioneLavoro" :lavoroID="record.lavoroID" />
    </v-dialog>
  </div>
</template>

<style scoped>
/* Essentials */
.container {
  display: table;
}
.content {
  display: table-row;
  height: 100%;
}
.content-body {
  display: table-cell;
}
</style>


<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
import { v4 as uuidv4 } from 'uuid'
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
  @Prop({ type: Number, default: 600 }) height!: Number

  stepIndex = 0
  articoliSelezionati = new Array<ArticoloGeneraleConfigurato>()
  visualizzaNuovaPosizione = false
  posizioneSelezionataID = ''

  articoloDaEditareID = ''
  apriWM(id: string) {
    this.articoloDaEditareID = id
    this.stepIndex = 4
  }
  exitWizardMisure() {
    this.articoloDaEditareID = ''
    this.stepIndex = 3
  }

  get posizioneSelezionata() {
    if (this.posizioneSelezionataID) {
      return this.posizioni.find(pos => pos._id == this.posizioneSelezionataID) as Posizione
    } else {
      return new Posizione()
    }
  }
  set posizioneSelezionata(pos: Posizione) {
    this.posizioneSelezionata = pos
  }

  salvaPosizioneLavoro() {
    this.visualizzaNuovaPosizione = false
  }
  chiudiWizardPosizione() {
    this.visualizzaNuovaPosizione = false
  }

  nextStep() {
    this.stepIndex++
  }

  nextStep_posizioneSelezionata() {
    // Verifica se questa posizione è deve essere configurata
    if (this.getArticoliDellaPosizione(this.posizioneSelezionataID).length > 0) {
      // Salta direttamente al rilievo
      this.stepIndex = 3
    } else {
      this.articoliSelezionati = this.record.listaArticoliGen
      this.nextStep()
    }
  }

  backStep() {
    this.stepIndex--
  }

  onClick_ItemPos(e: string) {
    this.posizioneSelezionataID = e

    // Recupera gli articoli della posizione
    // let tmpArticoliPos = this.record.listaArticoliSpec.filter((spec) => spec.rifPosID == this.posizioneSelezionataID)
    // let tmpArtGen = []
    // for (const )
    // this.articoliSelezionati = this.record.listaArticoliGen.filter((gen) => tmpArticoliPos.indexOf(e) < 0)
  }

  exit() {
    this.articoliSelezionati = new Array<ArticoloGeneraleConfigurato>()
    this.posizioneSelezionataID = ''
    this.stepIndex = 0
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
      articoloSpec.rifPosID = this.posizioneSelezionata && this.posizioneSelezionata._id
      articoloSpec.rifSchedaID = artGen._id
      this.record.listaArticoliSpec.push(articoloSpec)
    }

    await this.$store.dispatch('rilievoModule/salva', undefined, { root: true })

    this.nextStep()
  }

  getArticoliDellaPosizione(posID: string): ArticoloSpecificoConfigurato[] {
    if (!this.record.listaArticoliSpec) {
      return []
    }
    let lista = this.record.listaArticoliSpec.filter(art => art.rifPosID === posID)
    return lista
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

  get getHeight() {
    let offset = -10
    if (this.$vuetify.breakpoint.xsOnly) {
      return this.$vuetify.breakpoint.height - 76 //+ offset
    } else {
      return 600 //+ offset
    }
  }
}
</script>