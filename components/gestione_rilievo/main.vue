<template>
  <div>
    <Panel>
      <div slot="toolbarTitle">
        <div v-if="$vuetify.breakpoint.xsOnly">
          <div class="d-flex justify-start align-center">
            <div>
              <v-avatar size="40" class="pb-0">
                <v-img
                  :src="ui.imgURL || require('../../assets/images/rilievo.png')"
                ></v-img>
              </v-avatar>
            </div>
            <div class="pl-1">
              <div class="subtitle-1 ellipseText">
                <b>{{ record.descrizione }}</b>
              </div>
            </div>
          </div>
        </div>
        <div v-else>Gestione rilievo</div>
      </div>

       <div
        v-if="$vuetify.breakpoint.xsOnly"
        slot="panelToolbarRight"
        class="mr-1"
      >
        <v-row>
          <v-col cols="2" class="align-self-center">
            <v-btn icon @click="openEditForm">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div slot="mainContent">
        <div v-if="$vuetify.breakpoint.smAndUp">
          <v-row class="mx-2">
              <v-col cols="auto">
                <v-avatar size="75" class="pb-0">
                  <v-img
                    :src="
                      ui.imgURL || require('../../assets/images/rilievo.png')
                    "
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col class="align-self-center">
                <div class="title ellipseText">
                  <b>{{ record.descrizione }}</b>
                </div>
                <div class="subtitle-1 ellipseText">
                  {{ record.utente }} - {{ record.dataCreazione | dmy }}
                </div>
              </v-col>
              <v-col cols="auto" class="pb-0">
                <v-row class="pb-0">
                  <v-col cols="2" class="align-self-center">
                    <v-btn icon color="primary" @click="openEditForm()">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="2" class="align-self-center">
                    <v-btn icon color="primary">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          <v-divider></v-divider>
        </div>

        <v-tabs centered>
          <v-tab>GENERALE</v-tab>
          <v-tab>SCHEDE</v-tab>
          <v-tab>POSIZIONI</v-tab>
          <v-tab>RIEP X ART</v-tab>
          <v-tab>RIEP X POS</v-tab>

          <v-tab-item :class="$vuetify.breakpoint.xsOnly ? 'c_small' : 'c_large'" class="pa-0">
            <!-- Dati del rilievo -->
            <datiAnagrafici />
          </v-tab-item>

          <v-tab-item :class="$vuetify.breakpoint.xsOnly ? 'c_small' : 'c_large'" class="pa-0">
            <!-- SCHEDE - dati generali -->
            <schede />
          </v-tab-item>

          <v-tab-item :class="$vuetify.breakpoint.xsOnly ? 'c_small' : 'c_large'">
            <!-- FORI - posizioni -->
            <fori />
          </v-tab-item>

          <v-tab-item :class="$vuetify.breakpoint.xsOnly ? 'c_small' : 'c_large'">
            <!-- Lista Per articolo -->
            <list-per-articolo />
          </v-tab-item>

          <v-tab-item :class="$vuetify.breakpoint.xsOnly ? 'c_small' : 'c_large'">
            <!-- Lista Per posizione -->
            <listPerPosizione />
          </v-tab-item>
        </v-tabs>
      </div>
    </Panel>

    <!-- Wizard per dati generali -->
    <v-dialog v-model="ui.visualizzaWizardSchede" :fullscreen="$vuetify.breakpoint.xsOnly" persistent max-width="400px"  max-height="400px">
      <wizardSchede @onExit="chiudiWizardSchede" @onSave="salvaArticoloGenerale" />
    </v-dialog>

    <!-- WIZARD DEL RILIEVO -->
    <v-dialog v-model="ui.visualizzaWizardRilievo" :fullscreen="$vuetify.breakpoint.xsOnly" persistent max-width="400px"  :height="getHeightDialog">
      <wizardRilievo :height="getHeightDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop, Action } from 'nuxt-property-decorator'

import Panel from '../Containers/Panel.vue'
import Schede from '../gestione_rilievo/schede.vue'
import Fori from '../gestione_rilievo/fori.vue'
import wizardSchede from '@/components/GestioneRilievo/wizardSchede.vue'
import wizardRilievo from '@/components/gestione_rilievo/wizardRilievo.vue'
import listPerArticolo from '@/components/gestione_rilievo/riepilogoPerArticolo.vue'
import listPerPosizione from '@/components/gestione_rilievo/riepilogoPerPosizione.vue'
import datiAnagrafici from '@/components/gestione_rilievo/datiAnagrafici.vue'

import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'

@Component({ components: { Panel, Schede, Fori, wizardSchede, wizardRilievo, listPerArticolo, listPerPosizione, datiAnagrafici }, name: 'rilievo' })
export default class RilievoMain extends Vue {
  @State(state => state.rilievoModule.record) record !: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  salvaArticoloGenerale() {
    this.chiudiWizardSchede()
  }

  openEditForm(){

  }

  chiudiWizardSchede() {
    this.ui.visualizzaWizardSchede = false
  }

  @Prop({ type: String, default: '' }) readonly id!: string

  mounted() {
    this.$store.dispatch('posizioneModule/loadPosizioni', this.record.lavoroID, { root: true })
  }

  get getHeightDialog() {
    let offset = -10
    if (this.$vuetify.breakpoint.xsOnly) {
      return this.$vuetify.breakpoint.height
    } else {
      if (this.$vuetify.breakpoint.height > 600){
        return 600
      }else
      {
        return this.$vuetify.breakpoint.height
      }
    }
  }

}
</script>

<style scoped>
.c_small {
  height: calc(100vh - 110px);
  overflow: auto;
}
.c_large {
  min-height: 200px;
  max-height: calc(100vh - 250px);
  overflow: auto;
}
</style>