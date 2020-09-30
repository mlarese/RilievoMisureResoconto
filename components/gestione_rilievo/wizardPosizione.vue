<template>
  <v-card>
    <v-stepper v-model="stepIndex" style="height: 100%">
      <!-- DATI DELLA POSIZIONE -->
      <v-stepper-content step="0">
        <v-card-title>Dati della posizione</v-card-title>
        <v-card-text>
          <v-text-field v-model="localPos.posizione" label="Posizione" hint="Ad esempio 1, 2 ecc" persistent-hint> </v-text-field>
          <v-text-field v-model="localPos.descrizione" label="Descrizione" hint="Ad esempio cucina, lato nord ecc." persistent-hint> </v-text-field>
        </v-card-text>

         <p class="text-center pt-3">
      Scatta una nuova foto per ricordare la posizione
    </p>
        <v-card flat class="d-flex justify-center">
          <v-btn fab><v-icon>mdi-camera-plus-outline</v-icon></v-btn>
        </v-card>

        <v-card-actions class="pt-3">
          <v-btn text @click="onAbort" color="grey darken-1">ANNULLA</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="onSave" color="green">SALVA</v-btn>
        </v-card-actions>
      </v-stepper-content>

      <!-- ARTICOLI DELLA POSIZIONE -->
      <v-stepper-content step="1">
        <v-card-title>
          Articoli della posizione
        </v-card-title>
      </v-stepper-content>
    </v-stepper>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
// import { getPosizioneModule } from '~/store'
import { Posizione } from '@/store/posizioneModule'

@Component({ components: {}, name: 'Fori' })
export default class RilievoFori extends Vue {
  localPos = new Posizione()
  stepIndex = 0

  @Prop({ type: String, default: '' }) readonly lavoroID!: string

  async onSave() {
    this.localPos.lavoroID = this.lavoroID
    console.log(this.localPos)
    await this.$store.dispatch('posizioneModule/save', this.localPos, { root: true })
    this.$emit('onSave')
  }

  onAbort(){
    this.$emit('onExit')
  }
}
</script>