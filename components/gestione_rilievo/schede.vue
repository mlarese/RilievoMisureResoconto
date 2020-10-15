<template>
  <v-card flat :style="`height:${getHeight}px`">
    <v-card-text :style="{ height: 'calc(100% - 36px)', overflow: 'auto' }">
      <listaSchede />
    </v-card-text>
    <v-btn absolute rounded dark bottom right color="primary" @click="aggiungiArticoloClick"><v-icon>mdi-plus</v-icon>AGGIUNGI SCHEDA</v-btn>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter } from 'nuxt-property-decorator'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'

import listaSchede from '@/components/gestione_rilievo/listaSchede.vue'

@Component({ components: { listaSchede }, name: 'schede' })
export default class RilievoSchede extends Vue {
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  aggiungiArticoloClick() {
    this.ui.visualizzaWizardSchede = true
  }

  get getHeight() {
    let offset = -10
    if (this.$vuetify.breakpoint.xsOnly) {
      return this.$vuetify.breakpoint.height - 120 //+ offset
    } else {
      return this.$vuetify.breakpoint.height - 300 //+ offset
    }
  }

  editArtGen(id: string) {}

  deleteArtGen(id: string) {}
}
</script>