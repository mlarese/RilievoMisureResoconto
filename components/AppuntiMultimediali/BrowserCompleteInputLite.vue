<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-text-field
        label="Aggiungi una didascalia..."
        v-model="$record.data.EV_Descrizione"
        hide-details
      />
    </v-col>

    <v-col cols="12" class="py-0">
      <!-- <ClassificazioneForm :record="$record.data"/> -->
      <v-autocomplete
        label="Classificazione appunto..."
        :items="listaClassEventi"
        item-text="CCDescrizione"
        item-value="CCID"
        v-model="$record.data.EV_Classificazione"
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>
<script>
import ClassificazioneForm from '../Classificazione/ClassificazioneForm'
import { appuntimm } from './browsermx'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  mixins: [appuntimm],
  components: { ClassificazioneForm },
  computed: {
    ...mapGetters('classificazione', ['listaClassEventi'])
  },
  methods: {
    ...mapActions('classificazione', ['load']),
    annullaModifiche() {
      this.cancelAppunto()
    },
    salvaModifiche() {
      this.save()
    }
  },
  mounted() {
    this.load()
  }
}
</script>
