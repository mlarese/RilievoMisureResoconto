<template>
  <v-container>
    <!-- Lista articoli generali -->
    <v-card v-for="(artGen, iag) in record.listaArticoliGen" :key="iag" class="mb-1">
      <v-input :hint="artGen.subDescrizione" dense persistent-hint :hide-details="artGen.subDescrizione == ''">
        {{ artGen.descrizione }}
      </v-input>

      <v-row v-for="(artSpec, ias) in getArtSpec_By_ArtGen(artGen._id)" :key="ias">
        <v-col>{{getPosizioneDesc(artSpec.rifPosID)}}</v-col>
        <v-col>
          <ImmagineDet :drawingCommands="artSpec.drawingCommands" :imgWidth="50" :imgHeight="50"></ImmagineDet>
        </v-col>
        <v-col> </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
import ImmagineDet from '@/components/GestioneRilievo/ImmagineDet.vue'

import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato, JSArticolo, PropertyValued, JSTableRow } from '@/store/articoloModel'
import JSArtProp from '~/models/JSArtProp'
import { Posizione } from '~/store/posizioneModule'

@Component({ components: { ImmagineDet }, name: 'riepilogoPerArticolo' })
export default class RilievoFori extends Vue {
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI
@Getter('posizioneModule/posizioni') posizioni!: Posizione[]

  getArtSpec_By_ArtGen(schedaID: string): any[] {
    // const unique = [...new Set(this.record.listaArticoliSpec.map(item => item.rifSchedaID))]

    return this.record.listaArticoliSpec.filter(art => art.rifSchedaID == schedaID)
  }

  getPosizioneDesc(posID: string){
      return this.posizioni.find(p => p._id == posID)?.posizione
  }
}
</script>