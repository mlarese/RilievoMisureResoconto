<template>
  <v-layout rows wrap>
    <v-flex>
      <DbMonitor/>
    </v-flex>
  </v-layout>
</template>

<script>
import DbMonitor from '../components/Db/DbMonitor'

export default {
  components: {DbMonitor},
  fetch ({store}) {
    //store.dispatch('sync/importLavori',{}, {root: true})
    store.dispatch('sync/updateStatus',{}, {root: true})
  }
}
</script>
