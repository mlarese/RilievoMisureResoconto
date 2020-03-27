<template>
  <div>
    <v-layout rows wrap>
      <v-flex s12>
        <DbMonitor/>
        <!-- v-btn @click="readFs">read</v-btn>
        <img ref="previewImg" :src="null" -->
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DbMonitor from '../components/Db/DbMonitor'
import {fs, previewFile} from '../assets/filesystem'

export default {
  components: {DbMonitor},
  methods: {
    async readFs () {
      let f = '/apps/rilievomisure/Immagini/chri.png'
      previewFile(f, this.$refs['previewImg'])
    }
  },
  data () {
    return {}
  },
  fetch ({store}) {
    //store.dispatch('sync/importLavori',{}, {root: true})
    store.dispatch('sync/updateStatus',{}, {root: true})
  }
}
</script>
