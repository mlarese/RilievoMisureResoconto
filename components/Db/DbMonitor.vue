<template>
  <v-card class="pa-5 mx-auto" max-width="400">
    <div class=" d-flex justify-center">
      <v-card-title>Sincronizzazione</v-card-title>
    </div>

    <div v-if="synchronizing" class=" d-flex justify-center">
      <v-progress-circular :rotate="360" :size="100" :width="15" :value="ui.progrex" color="success">
        {{ Math.round(ui.progrex) }}
      </v-progress-circular>
    </div>
    <div v-else class=" d-flex justify-center">
      <v-btn @click="syncAll" block color="success"> Avvia<v-icon class="pl-2">mdi-rocket-launch-outline</v-icon> </v-btn>
    </div>

    <div class="pt-5 d-flex justify-center">
      <p>{{ ui.message }}</p>
    </div>

    <v-card-actions class="py-0">
      <v-card-subtitle>
        Visualizza log
      </v-card-subtitle>
      <v-spacer></v-spacer>

      <v-btn icon @click="showLog = !showLog">
        <v-icon>{{ showLog ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showLog">
        <v-divider></v-divider>
        <v-textarea v-model="ui.syncLog" dense readonly hide-details/>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Panel from '../Containers/Panel'
import appuntimmJson from '../../storeimp/fixtures/appuntimm.json'

export default {
  components: { Panel },
  data() {
    return { showLog: false }
  },
  methods: {
    ...mapActions('sync', ['syncAll']),
    ...mapActions('appuntimm', ['setDemo']),
    syncAppuntiDemo() {
      this.setDemo(appuntimmJson)
    }
  },
  computed: {
    ...mapState('sync', ['synchronizing', 'ui'])
  }
}
</script>

<style scoped>
</style>
