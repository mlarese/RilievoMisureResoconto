<template>
  <v-container>
    <!-- Aggiungere nuova scheda dati generali -->
    <v-btn rounded color="primary" dark small @click="aggiungiArticoloClick" class="ma-2"> aggiungi articolo <v-icon>mdi-plus</v-icon> </v-btn>

    <!-- Elenco schede già compilate -->
    <v-expansion-panels focusable>
      <v-expansion-panel v-for="(artGen, i) in listaArticoliGen" :key="i">
        <v-expansion-panel-header>
          <v-row no-gutters dense>
            <v-col cols="1">
              <v-btn icon x-small @click="editArtGen(artGen._id)"><v-icon>mdi-pencil</v-icon></v-btn>
            </v-col>
            <v-col>{{ artGen.descrizione }}</v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pt-2">
          <div v-for="(prop, j) in artGen.listaPropValued" :key="j">
            <p>{{ prop.propLabel }} : {{ prop.propValue }}</p>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>


<script lang="ts">
import { Vue, Component, namespace, State, Getter } from 'nuxt-property-decorator'
import { getRilievoModule } from '~/store'

@Component({ components: {}, name: 'schede' })
export default class RilievoSchede extends Vue {
  get record() {
    return getRilievoModule(this.$store).record
  }
  get ui() {
    return getRilievoModule(this.$store).ui
  }

  get listaArticoliGen() {
    return this.record.listaArticoliGen
  }

  aggiungiArticoloClick() {
    this.ui.visualizzaWizardSchede = true
  }
}
</script>