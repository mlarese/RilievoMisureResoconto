<template>
  <div>
    <v-stepper v-model="stepIndex">
      <!-- sezione SCHEDE -->
      <v-stepper-content step="-2" class="pa-0">
        <v-card :height="height">
          <v-toolbar flat>
            <v-toolbar-title v-text="'Schede del rilievo'" />
            <v-spacer></v-spacer>
            <v-btn fab x-small @click="showInfo = !showInfo" class="blink_me" color="primary lighten-2"><v-icon>mdi-information-outline</v-icon></v-btn>
          </v-toolbar>
          <v-bottom-sheet v-model="showInfo" inset>
            <v-sheet class="text-center">
              <v-btn class="mt-6" text color="red" @click="showInfo = !showInfo">
                Chiudi
              </v-btn>
              <div class="pa-3">
                La scheda è l'insieme delle caratteristiche che accomunano tutte le versioni di un articolo. <br />
                Se effettuiamo il rilievo di 10 serramenti, molto probabilmente avranno tutti le stesse caratteristiche: modello, colore, ... <br />
                Ecco che queste caratteristiche uguali relative all'articolo serramento, verranno inserite in questa pagina una volta soltanto e poi
                semplicemente richiamate.
              </div>
            </v-sheet>
          </v-bottom-sheet>

          <v-card-text class="pt-1" :style="{ height: height - 180 + 'px', 'overflow-y': 'auto' }">
            <listaSchede />
          </v-card-text>

          <v-footer absolute class="py-4">
            <v-btn color="primary" dark absolute top fab @click="apriWizardSchede" class="fabCenter">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-card elevation="0" class="fabRientranza" />
            <v-btn text large color="gray" @click="exit">ANNULA</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              outlined
              large
              color="green"
              @click="stepIndex = 0"
              :disabled="record.listaArticoliGen === undefined || record.listaArticoliGen.length == 0"
            >
              AVANTI<v-icon>mdi-chevron-right</v-icon></v-btn
            >
          </v-footer>
        </v-card>
      </v-stepper-content>

      <!-- WIZARD SCHEDE -->
      <v-stepper-content step="-1" class="pa-0">
        <v-card :height="height">
          <wizardSchede :height="height" @onExit="chiudiWizardSchede" @onSave="salvaArticoloGenerale" />
        </v-card>
      </v-stepper-content>

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
                    <template v-slot:default="{ active }">
                      <v-list-item-content>
                        <v-list-item-title v-text="`${pos.posizione} - ${pos.descrizione}`"></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-icon v-if="active">mdi-check</v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                  <v-divider v-if="i < posizioni.length - 1" :key="i + 'div'"></v-divider>
                </template>
              </v-list-item-group>
            </v-list>

            <v-container v-else class="fill-height d-flex flex-column align-center justify-center">
              <v-img :src="require('../../assets/images/posizione-empty-list.png')" contain max-width="50%" max-height="50%"></v-img>
              <p class="title text-center">Nussuna posizione presente</p>
              <p class="caption font-weight-light text-center" style="margin-top: -20px;">
                Inizia cliccando sul pulsante (+) qui in basso
              </p>
            </v-container>
          </v-card-text>

          <v-footer absolute class="py-4">
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
            <v-btn large text color="gray" @click="stepIndex = -2">INDIETRO</v-btn>
            <v-spacer></v-spacer>
            <v-btn large text outlined color="green" @click="nextStep_posizioneSelezionata" :disabled="posizioneSelezionata._id == ''">
              AVANTI<v-icon>mdi-chevron-right</v-icon></v-btn
            >
          </v-footer>
        </v-card>
      </v-stepper-content>

      <!-- Selezione SCHEDE della POSIZIONE -->
      <v-stepper-content step="1" class="pa-0">
        <v-card :height="height">
          <v-card-title>Indicare gli articoli per la posizione</v-card-title>
          <v-card-subtitle>{{ posizioneSelezionata.posizione }} - {{ posizioneSelezionata.descrizione }}</v-card-subtitle>

          <!-- Visualizza gli articoli delle schede -->
          <v-card-text :style="{ height: height - 112 + 'px', 'overflow-y': 'auto' }">
            <v-list two-line>
              <v-list-item-group v-model="articoliSelezionatiID" multiple color="primary">
                <template v-for="(artGen, iag) in record.listaArticoliGen">
                  <v-list-item :key="iag" :value="artGen._id">
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

          <v-footer absolute class="py-4">
            <v-btn color="primary" dark absolute top fab :style="{ left: '50%', transform: 'translateX(-50%)' }" @click="aggiungiScheda">
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
            <v-btn large text color="gray" @click="backStep"><v-icon>mdi-chevron-left</v-icon>INDIETRO</v-btn>
            <v-spacer></v-spacer>
            <v-btn large text outlined color="green" @click="salvaPosizione" :disabled="articoliSelezionatiID.length == 0">SALVA</v-btn>
          </v-footer>
        </v-card>
      </v-stepper-content>

      <!-- Articoli da misurare -->
      <v-stepper-content step="3" class="pa-0">
        <v-card :height="height">
          <v-toolbar color="#e4effa">
            <v-toolbar-title>{{ posizioneSelezionata.posizione }} - {{ posizioneSelezionata.descrizione }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="openMediaPos(posizioneSelezionata._id)"><v-icon>mdi-folder-multiple-image</v-icon></v-btn>

            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list>
                <v-list-item @click="stepIndex = 1">
                  <v-list-item-title>Aggiungi articolo</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-card-title>E' ora di misurare...</v-card-title>
          <v-card-subtitle>
            Seleziona un articolo alla volta e segui le domande per la configurazione
          </v-card-subtitle>

          <v-card-text style="overflow-y: auto;">
            <v-list-item-group>
              <v-list-item v-for="(art, i) in getArticoliDellaPosizione(posizioneSelezionataID)" :key="i">
                <v-list-item-icon v-if="art.listaPropValued.length == 0">
                  <v-icon color="red">mdi-alert</v-icon>
                </v-list-item-icon>

                <v-list-item-icon v-else>
                  <v-icon color="green">mdi-checkbox-marked-circle-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content @click="apriWM(art._id)">
                  <v-list-item-title>{{ getArtGen(art.rifSchedaID).descrizione }}</v-list-item-title>
                  <v-list-item-subtitle>{{ getArtGen(art.rifSchedaID).subDescrizione }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon @click="eliminaArtSpec(art._id)">mdi-delete-outline</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
            </v-list-item-group>
          </v-card-text>
          <v-footer absolute class="py-4">
            <v-btn large text color="gray" @click="exit">FINE</v-btn>
            <v-spacer></v-spacer>
            <v-btn large text outlined color="green" @click="stepIndex = 0">Cambia posizione</v-btn>
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

    <confirmDialog ref="confirmDialog" />
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

.blink_me {
  animation: blinker3 1.5s ease-in-out infinite alternate;
}
@keyframes blinker3 {
  to {
    opacity: 0.2;
  }
}
</style>


<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
import { v4 as uuidv4 } from 'uuid'
import wizardPosizione from '@/components/gestione_rilievo/wizardPosizione.vue'
import wizardMisure from '@/components/gestione_rilievo/wizardMisure.vue'
import media from '@/components/AppuntiMultimediali/Browser.vue'
import listaSchede from '@/components/gestione_rilievo/listaSchede.vue'
import wizardSchede from '@/components/GestioneRilievo/wizardSchede.vue'
import confirmDialog from '@/components/General/ConfirmDialog.vue'

import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { Posizione } from '@/store/posizioneModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato } from '@/store/articoloModel'

@Component({ components: { wizardPosizione, wizardMisure, media, listaSchede, wizardSchede, confirmDialog }, name: 'Fori' })
export default class RilievoFori extends Vue {
  @Getter('posizioneModule/posizioni') posizioni!: Posizione[]
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI
  @Prop({ type: Number, default: 600 }) height!: Number

  showInfo = false

  fab = false
  stepIndex = -2
  return_stepIndex: number | undefined = undefined
  articoliSelezionatiID = new Array<string>() //new Array<ArticoloGeneraleConfigurato>()
  visualizzaNuovaPosizione = false
  posizioneSelezionataID = ''

  aggiungiScheda() {
    this.stepIndex = -1
    this.return_stepIndex = 1
  }

  visualizzaMedia = false
  rif_x_Media = {}

  openMediaPos(pos_id: string) {
    this.rif_x_Media = { job_id: this.record.lavoroID, pos_id }
    this.visualizzaMedia = true
  }
  exitMultimedia() {
    this.visualizzaMedia = false
  }

  apriWizardSchede() {
    this.$store.dispatch('articoli/load')
    this.stepIndex = -1
  }

  chiudiWizardSchede() {
    if (this.return_stepIndex == undefined) {
      this.stepIndex = -2
    } else {
      this.stepIndex = this.return_stepIndex as number
      this.return_stepIndex = undefined
    }
  }
  salvaArticoloGenerale() {
    if (this.return_stepIndex == undefined) {
      this.stepIndex = -2
    } else {
      this.stepIndex = this.return_stepIndex as number
      this.return_stepIndex = undefined
    }
  }

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
    // Verifica se questa posizione deve essere configurata
    if (this.getArticoliDellaPosizione(this.posizioneSelezionataID).length > 0) {
      // Salta direttamente al rilievo
      this.stepIndex = 3
    } else {
      this.articoliSelezionatiID = this.record.listaArticoliGen.map(a => a._id) as string[]
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
    this.articoliSelezionatiID = new Array<string>()
    this.posizioneSelezionataID = ''
    this.stepIndex = -2
    this.ui.visualizzaWizardRilievo = false
  }

  async salvaPosizione() {
    // Crea un nuovo articolo specifico per ogni articolo generico
    // In questa fase non sarà ancora configurato

    if (!this.record.listaArticoliSpec) {
      this.record.listaArticoliSpec = new Array<ArticoloSpecificoConfigurato>()
    }

    for (const artGenID of this.articoliSelezionatiID) {
      let articoloSpec = new ArticoloSpecificoConfigurato()
      articoloSpec._id = uuidv4()
      articoloSpec.rifPosID = this.posizioneSelezionata && this.posizioneSelezionata._id
      articoloSpec.rifSchedaID = artGenID
      this.record.listaArticoliSpec.push(articoloSpec)
    }

    await this.$store.dispatch('rilievoModule/salva', undefined, { root: true })

    this.stepIndex = 3
  }

  async eliminaArtSpec(id: string) {
    let dialog = this.$refs.confirmDialog as any
    let response = await dialog.open('Confermare', 'Si è certi di voler eliminare larticolo?', {})

    if (response) {
      // ELIMINA DEFINITIVAMENTE
      this.$store.dispatch('rilievoModule/deleteArtSpec', id)
    }
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
    let artBase = new ArticoloGeneraleConfigurato()
    for (const art of this.record.listaArticoliGen) {
      if (art._id == artGenID) {
        artBase = art
      }
    }
    return artBase
  }

  get getHeight() {
    let offset = -10
    if (this.$vuetify.breakpoint.xsOnly) {
      return this.$vuetify.breakpoint.height - 76 //+ offset
    } else {
      return 600 //+ offset
    }
  }

  mounted() {
    // document.addEventListener('keydown', event => {
    //   console.log('keydown', event)
    //   event.preventDefault()
    // })
    // document.addEventListener('keyup', event => {
    //   console.log('keyup', event)
    //   event.preventDefault()
    // })
  }
}
</script>

<style scoped>
.fabRientranza {
  position: absolute;
  left: 50%;
  top: 0px;
  transform: translateX(-50%);
  border-radius: 0 0 75px 75px;
  width: 75px;
  height: 38px;
  background-color: white;
}

.fabCenter {
  left: 50%;
  transform: translateX(-50%);
}
</style>