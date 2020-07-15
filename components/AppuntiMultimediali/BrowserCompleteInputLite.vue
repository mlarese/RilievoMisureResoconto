<template>

      <v-row>
        <v-col cols="12" class="py-0">
          <v-text-field label="Descrizione"   v-model="$record.data.EV_Descrizione"  hide-details  />
        </v-col>

        <v-col cols="12"  class="py-0">
          <v-text-field label="Note"   v-model="$record.data.EV_Note" hide-details  />
        </v-col>
        <v-col cols="12"  class="py-0">
          <ClassificazioneForm :record="$record.data"/>
        </v-col>

      </v-row>

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
