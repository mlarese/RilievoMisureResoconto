<template>
  <div>
    <!-- Elenco schede già compilate -->
    <div v-if="record.listaArticoliGen && record.listaArticoliGen.length > 0">
      <v-expansion-panels focusable>
        <v-expansion-panel v-for="(artGen, i) in record.listaArticoliGen" :key="i">
          <v-expansion-panel-header>
            <v-row class="py-0" no-gutters>
              <v-col cols="12" class="py-0">
                <v-input v-if="artGen.subDescrizione" :hint="artGen.descrizione" dense persistent-hint>
                  {{ artGen.subDescrizione }}
                </v-input>
                <v-input v-else dense persistent-hint>
                  {{ artGen.descrizione }}
                </v-input>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pt-2">
            <div v-for="(prop, j) in artGen.listaPropValued" :key="j">
              <p>{{ prop.propLabel }} : {{ prop.propValueDecode }}</p>
            </div>

            <v-card-actions class="pa-0">
              <v-spacer></v-spacer>
              <v-btn text small @click="editArtGen(artGen._id)"><v-icon>mdi-pencil</v-icon>Modifica</v-btn>
              <v-btn text small @click="tryDeleteArtGen(artGen._id)"><v-icon>mdi-trash-can-outline </v-icon>Elimina</v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <v-container v-else class="fill-height d-flex flex-column align-center justify-center">
      <v-img :src="require('../../assets/images/schede-empty-list.png')" contain max-width="50%" max-height="50%"></v-img>
      <p class="title text-center">Non sono state aggiunte schede</p>
      <p class="caption font-weight-light text-center" style="margin-top: -20px;">
        Usa il pulsante qui in basso per aggiungerne
      </p>
    </v-container>

    <confirmDialog ref="confirmDialog" />
    <alertDialog ref="alertDialog" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter } from 'nuxt-property-decorator'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'
import confirmDialog from '@/components/General/ConfirmDialog.vue'
import alertDialog from '@/components/General/AlertDialog.vue'

@Component({ components: { confirmDialog, alertDialog }, name: 'listaSchede' })
export default class RilievoSchede extends Vue {
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  editArtGen(id: string) {}

  async tryDeleteArtGen(id: string) {
    // Verifica se questo articolo è già stato utilizzato

    let lista: any[] = []
    if (this.record.listaArticoliSpec) {
      lista = this.record.listaArticoliSpec.filter(art => art.rifSchedaID == id)
    }
    console.log(lista)
    if (lista.length > 0) {
      // NON è possbile cancellare
      let dialog = this.$refs.alertDialog as any
      dialog.open('Attenzione', 'non è possibile eliminare questa scheda in quanto è già stata utilizzata.', {})
    } else {
      let dialog = this.$refs.confirmDialog as any
      let response = await dialog.open('Confermare', 'Si è certi di voler eliminare la scheda?', {})

      if (response) {
        // ELIMINA DEFINITIVAMENTE
        this.$store.dispatch('rilievoModule/deleteArtGen', id)
      }
    }
  }

  deleteArt() {}
}
</script>