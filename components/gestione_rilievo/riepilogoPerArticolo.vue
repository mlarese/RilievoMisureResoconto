<template>
  <v-container>
    <v-switch v-model="visualizzaImg" label="Visualizza immagini" class="pa-0 ma-0"></v-switch>
    <!-- Lista articoli generali -->
    <v-card v-for="(artGen, iag) in record.listaArticoliGen" :key="iag" class="mb-2">
      <v-card-title>
        <v-row class="py-0" no-gutters>
          <v-col cols="12" class="py-0">
            <v-input v-if="artGen.subDescrizione" dense hide-details> {{ artGen.descrizione }} - {{ artGen.subDescrizione }} </v-input>
            <v-input v-else dense hide-details>
              {{ artGen.descrizione }}
            </v-input>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-subtitle class="pb-0">
        <div v-for="(prop, j) in artGen.listaPropValued" :key="j">
          <p class="ma-0">{{ prop.propLabel }} : {{ prop.propValueDecode }}</p>
        </div>
      </v-card-subtitle>

      <!-- TABELLA PER SERRAMENTO -->
      <v-simple-table v-if="artGen.artClass == '$PC_SER'">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Posizione</th>
              <th class="text-left" v-if="visualizzaImg">Immagine</th>
              <th>Tipo</th>
              <th>Ante</th>
              <th>Apertura</th>
              <th>Larghezza</th>
              <th>Altezza</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(artSpec, ias) in getArtSpec_By_ArtGen(artGen._id)" :key="ias">
              <td>{{ getPosizione(artSpec.rifPosID).posizione }} - {{ getPosizione(artSpec.rifPosID).descrizione }}</td>
              <td v-if="visualizzaImg">
                <ImmagineDet :drawingCommands="artSpec.drawingCommands" :imgWidth="50" :imgHeight="50"></ImmagineDet>
              </td>
              <td>{{ getTipologia(artSpec) }}</td>
              <td>{{ getAnte(artSpec) }}</td>
              <td>{{ getApertura(artSpec) }}</td>
              <td>{{ getLarghezza_SER(artSpec) }}</td>
              <td>{{ getAltezza_SER(artSpec) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <!-- TABELLA PER ALTRI ARTICOLI -->
      <v-simple-table v-else>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Posizione</th>
              <th class="text-left" v-if="visualizzaImg">Immagine</th>
              <th>Larghezza</th>
              <th>Altezza</th>
              <th>Profondità</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(artSpec, ias) in getArtSpec_By_ArtGen(artGen._id)" :key="ias">
              <td>{{ getPosizione(artSpec.rifPosID).posizione }} - {{ getPosizione(artSpec.rifPosID).descrizione }}</td>
              <td v-if="visualizzaImg">
                <v-avatar class="ma-3" size="60" tile>
                  <myIMG :artGen="artGen" :key="ias + 'img'"></myIMG>
                </v-avatar>
              </td>
              <td>{{ getLarghezza(artSpec) }}</td>
              <td>{{ getAltezza(artSpec) }}</td>
              <td>{{ getProfondita(artSpec) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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

@Component({ components: { ImmagineDet, myIMG }, name: 'riepilogoPerArticolo' })
export default class Riepilogo_x_Art extends Vue {
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI
  @Getter('posizioneModule/posizioni') posizioni!: Posizione[]

  visualizzaImg = true

  getArtSpec_By_ArtGen(schedaID: string): any[] {
    // const unique = [...new Set(this.record.listaArticoliSpec.map(item => item.rifSchedaID))]
    if (this.record.listaArticoliSpec) {
      return this.record.listaArticoliSpec.filter(art => art.rifSchedaID == schedaID)
    } else {
      return []
    }
  }

  getPosizione(posID: string) {
    let pos = this.posizioni.find(p => p._id == posID)
    return pos || new Posizione()
  }

  getTipologia(artSpec: ArticoloSpecificoConfigurato) {
    return artSpec.listaPropValued.find(p => p.propName == 'TIPO_SERRAMENTO')?.propValue
  }

  getAnte(artSpec: ArticoloSpecificoConfigurato) {
    return artSpec.listaPropValued.find(p => p.propName == '#GRP_ANTE.PR_NUMERO_ANTE')?.propValue
  }

  getApertura(artSpec: ArticoloSpecificoConfigurato) {
    return artSpec.listaPropValued.find(p => p.propName == '#GRP_ANTE.PR_SISTEMA_APERTURA')?.propValue
  }

  getLarghezza_SER(artSpec: ArticoloSpecificoConfigurato) {
    return artSpec.listaPropValued.find(p => p.propName == '#SER.PR_L')?.propValue
  }

  getAltezza_SER(artSpec: ArticoloSpecificoConfigurato) {
    let hsx = artSpec.listaPropValued.find(p => p.propName == '#SER.PR_H_SX')?.propValue
    let hdx = artSpec.listaPropValued.find(p => p.propName == '#SER.PR_H_DX')?.propValue

    if (hdx) {
      return hsx + '/' + hdx
    } else {
      return hsx
    }
  }

  getLarghezza(artSpec: ArticoloSpecificoConfigurato) {
    return artSpec.listaPropValued.find(p => p.propName == 'L')?.propValue
  }

  getAltezza(artSpec: ArticoloSpecificoConfigurato) {
    return artSpec.listaPropValued.find(p => p.propName == 'H')?.propValue
  }

  getProfondita(artSpec: ArticoloSpecificoConfigurato) {
    return artSpec.listaPropValued.find(p => p.propName == 'P')?.propValue
  }

  getImmagine(artGen: ArticoloGeneraleConfigurato) {
    let id = `${artGen.azienda}.${artGen.catalogo}.${artGen.codice}`
    this.$store.dispatch('articoli/getById', id).then(art => {
      this.$store.dispatch('dm_resources/getRisorsaById', art.JSImmagineRisID).then(res => {
        return res.thumbnailUrl
      })
    })
  }
}
</script>