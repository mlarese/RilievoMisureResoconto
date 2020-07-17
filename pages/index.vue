<template>
  <div>
    <v-layout rows wrap>
      <v-flex s6>
        <DbMonitor />

        <pre v-if="false">
           {{errors}}
        </pre>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DbMonitor from '../components/Db/DbMonitor'
import { fs, previewFile } from '../assets/filesystem'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  components: { DbMonitor },
  data() {
    return {}
  },
  computed: {
    ...mapState('app', ['errors'])
  },
  fetch({ store }) {
    store.dispatch('sync/updateStatus', {}, { root: true })
  }
}
</script>
