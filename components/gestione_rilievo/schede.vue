<template>
  <v-card style="height: 100%;">
    <v-card-text :style="{ height: 'calc(100% - 36px)'}">
      <!-- Aggiungere nuova scheda dati generali -->
      <!-- <v-btn rounded color="primary" dark small @click="aggiungiArticoloClick" class="ma-2"> aggiungi articolo <v-icon>mdi-plus</v-icon> </v-btn> -->

      <!-- Elenco schede già compilate -->
      <v-expansion-panels focusable>
        <v-expansion-panel v-for="(artGen, i) in record.listaArticoliGen" :key="i">
          <v-expansion-panel-header>
            <v-row no-gutters dense>
              <v-col>{{ artGen.descrizione }}</v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pt-2">
            <div v-for="(prop, j) in artGen.listaPropValued" :key="j">
              <p>{{ prop.propLabel }} : {{ prop.propValue }}</p>
            </div>

            <v-card-actions class="pa-0">
              <v-spacer></v-spacer>
              <v-btn text small @click="editArtGen(artGen._id)"><v-icon>mdi-pencil</v-icon>Modifica</v-btn>
              <v-btn text small @click="deleteArtGen(artGen._id)"><v-icon>mdi-trash-can-outline </v-icon>Elimina</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions class="py-0 d-flex justify-center">
      <v-btn width="50%" text outlined color="indigo" @click="aggiungiArticoloClick"><v-icon>mdi-plus</v-icon> AGGIUNGI SCHEDA</v-btn>
      <v-btn width="50%"  text outlined color="indigo" @click="apriWizardRilievo"><v-icon>mdi-tape-measure</v-icon>INIZIA RILIEVO</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script lang="ts">
import { Vue, Component, namespace, State, Getter } from 'nuxt-property-decorator'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'

@Component({ components: {}, name: 'schede' })
export default class RilievoSchede extends Vue {
  @State(state => state.rilievoModule.record) record !: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  aggiungiArticoloClick() {
    this.ui.visualizzaWizardSchede = true
  }

  apriWizardRilievo(){
    this.ui.visualizzaWizardRilievo = true
  }

  editArtGen(id: string) {}

  deleteArtGen(id: string) {}
}
</script>