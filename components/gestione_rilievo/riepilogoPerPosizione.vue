<template>
  <v-container>
    <v-switch v-model="visualizzaImg" label="Visualizza immagini" class="pa-0 ma-0"></v-switch>

    <!-- Lista posizioni -->
    <v-card v-for="(pos, indx_pos) in posizioni" :key="indx_pos" class="mb-1">
      <v-card-title class="py-1">{{ pos.posizione }} - {{ pos.descrizione }}</v-card-title>

      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" v-if="visualizzaImg">Immagine</th>
                <th class="text-left">Articolo</th>
                <th>Larghezza</th>
                <th>Altezza</th>
                <th>Profondità</th>
                <th>Desc</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(art, indx_as) in getArticoliDellaPosizione(pos._id)" :key="indx_as">
                <td v-if="visualizzaImg">
                  <ImmagineDet v-if="art.artSpec.drawingCommands" :drawingCommands="art.artSpec.drawingCommands" :imgWidth="60" :imgHeight="60"></ImmagineDet>

                  <v-avatar v-else class="ma-3" size="60" tile>
                    <myIMG :artGen="art.artGen"></myIMG>
                  </v-avatar>
                </td>
                <td>{{ art.artGen.descrizione }}</td>
                <td>{{ getLarghezza(art) }}</td>
                <td>{{ getAltezza(art) }}</td>
                <td>{{ getProfondita(art) }}</td>
                <td></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
import ImmagineDet from '@/components/GestioneRilievo/ImmagineDet.vue'
import myIMG from '@/components/gestione_rilievo/myImage.vue'

import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato, JSArticolo, PropertyValued, JSTableRow } from '@/store/articoloModel'
import JSArtProp from '~/models/JSArtProp'
import { Posizione } from '~/store/posizioneModule'

@Component({ components: { ImmagineDet, myIMG }, name: 'riepilogoPerPosizione' })
export default class RilievoFori extends Vue {
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI
  @Getter('posizioneModule/posizioni') posizioni!: Posizione[]

  visualizzaImg = true

  getArticoliDellaPosizione(posID: string): any[] {
    if (!this.record.listaArticoliSpec) {
      return []
    }
    let listaArtSpec = this.record.listaArticoliSpec.filter(art => art.rifPosID === posID && art.listaPropValued && art.listaPropValued.length > 0)
    let listaResult = []

    for (const artSpec of listaArtSpec) {
      // Preleva l'articolo generico configurato
      let artGen = this.record.listaArticoliGen.filter(art => art._id === artSpec.rifSchedaID)[0]

      let artResult = { artGen, artSpec }

      listaResult.push(artResult)
    }

    return listaResult
  }

  getLarghezza({ artSpec, artGen }: any) {
    if (artGen.artClass == '$PC_SER') {
      return artSpec.listaPropValued.find((p: any) => p.propName == '#SER.PR_L')?.propValue
    } else {
      return artSpec.listaPropValued.find((p: any) => p.propName == 'L')?.propValue
    }
  }

  getAltezza({ artSpec, artGen }: any) {
    if (artGen.artClass == '$PC_SER') {
      let hsx = artSpec.listaPropValued.find((p: any) => p.propName == '#SER.PR_H_SX')?.propValue
      let hdx = artSpec.listaPropValued.find((p: any) => p.propName == '#SER.PR_H_DX')?.propValue

      if (hdx) {
        return hsx + '/' + hdx
      } else {
        return hsx
      }
    } else {
    }
    return artSpec.listaPropValued.find((p: any) => p.propName == 'H')?.propValue
  }

  getProfondita({ artSpec, artGen }: any) {
    if (artGen.artClass == '$PC_SER') return ''
    return artSpec.listaPropValued.find((p: any) => p.propName == 'P')?.propValue
  }
}
</script>