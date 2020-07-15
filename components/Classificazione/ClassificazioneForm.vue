<template>

        <ClassificazioneFactory :record="record" :structure="strutturaDiClassificazione" />

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
