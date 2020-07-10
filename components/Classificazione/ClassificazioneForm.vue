<template>
  <v-card>
    <v-card-title>Classificazione</v-card-title>
    <v-card-text>
      <template v-for="(item, label, index) in strutturaDiClassificazione">
        <ClassificazioneFactory :record="record" :label="label" :structure="item" :key="index"/>
      </template>
    </v-card-text>
  </v-card>
</template>
<script>
import {mapState} from 'vuex'
export default {
  props: {
    record: {type: Object, default: () => ({}) }
  },
  computed: {
    ...mapState('appuntimm', ["strutturaDiClassificazione"])
  }
}
</script>
