<template>
  <div>
    <v-layout rows wrap>
      <v-flex>
        <DbMonitor/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DbMonitor from '../components/Db/DbMonitor'

export default {
  components: {DbMonitor},
  fetch ({store}) {
    //store.dispatch('sync/importLavori',{}, {root: true})
    store.dispatch('sync/updateStatus',{}, {root: true})
  },
  created () {
    BrowserFS.configure({
      fs: 'HTML5FS',
      options: {
      }
    }, (e) => {
      let fs = BrowserFS.BFSRequire('fs')
      fs.mkdir('/apps')
      fs.mkdir('/apps/rilievomisure')
      fs.readdir('/apps', (e, contents) => {
        console.dir(contents)
      })
    })
  }
}
</script>
