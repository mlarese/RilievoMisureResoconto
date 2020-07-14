<template>
  <v-card>
    <v-card-title class="pt-1 pl-1 pb-0">Evento</v-card-title>
    <v-card-actions>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Descrizione"   v-model="$record.data.EV_Descrizione"  hide-details  />
        </v-col>

        <v-col cols="12">
          <v-text-field label="Note"   v-model="$record.data.EV_Note" hide-details  />
        </v-col>
        <v-col cols="12">
          <ClassificazioneForm :record="$record.data.EV_Classificazione"/>
        </v-col>
        <v-col cols="12">
            <span class="float-right">
            <v-btn color="blue darken-1" text @click="annullaModifiche()">Annulla</v-btn>
            <v-btn color="blue darken-1" text @click="salvaModifiche()">Salva</v-btn>
            </span>

        </v-col>
      </v-row>

    </v-card-actions>

  </v-card>
</template>
<script>
import ClassificazioneForm from '../Classificazione/ClassificazioneForm'
import { appuntimm } from './browsermx'

export default {
  mixins: [appuntimm],
  components: {ClassificazioneForm},
  methods: {
    annullaModifiche () {
      this.cancelAppunto()
    },
    salvaModifiche () {
      this.save()
    }
  }
}
</script>
