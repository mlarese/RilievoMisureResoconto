<template>
  <div>
    <v-layout rows wrap>
      <v-flex s6>
        <DbMonitor />

        <pre v-if="false">
           {{errors}}
        </pre>

        <v-btn @click="onClick">Chiama post message</v-btn>
        <v-btn @click="onClickLoadEventi">Chiama load eventi</v-btn>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DbMonitor from '../components/Db/DbMonitor'
import { fs, previewFile } from '../assets/filesystem'
import { mapState, mapGetters, mapActions } from 'vuex'
import {serviceWorker} from '../plugins/swlisteners'
export default {
  methods: {
    ...mapActions('swstore', ['loadEvents']),
    onClickLoadEventi () {
      this.loadEvents()
    },
    onClick () {
      console.clear()

      serviceWorker.active.postMessage({
        type: 'caricaEventi',
        token: 'kkkkkk',
        message: 'caricamento in background'
      })
    }
  },
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
