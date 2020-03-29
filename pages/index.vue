<template>
  <div>
    <v-layout rows wrap>
      <v-flex s12>
        <DbMonitor/>
        <pre v-if="false">
           {{errors}}
        </pre>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DbMonitor from '../components/Db/DbMonitor'
import {fs, previewFile} from '../assets/filesystem'
import {mapState} from 'vuex'
export default {
  components: {DbMonitor},
  methods: {
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('app', ['errors'])
  },
  fetch ({store}) {
    //store.dispatch('sync/importLavori',{}, {root: true})
    store.dispatch('sync/updateStatus',{}, {root: true})
  }
}
</script>
