<template>
    <v-card class="pa-5">
        <v-card-title>Stato Sincronizzazione</v-card-title>
        <v-layout rows wrap class="py-0" >
            <v-flex x12 class="text-xs-center py-0">
                <v-layout rows wrap >
                    <v-flex class="py-0 px-2 ma-0" xs12 v-for="(db, key) in dbStatus" :key="key">
                            <v-icon v-if="synchronized">mdi-database-check</v-icon>
                            <v-icon v-else>mdi-database-remove</v-icon>
                            {{key}}
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="dx-toolbar-center mt-5">
                <div>
                    <!-- v-alert dense :value="synchronized"  type="success"  >
                        Gli archivi sono sincronizzati
                    </v-alert -->

                    <v-alert dense :value="!synchronized && !synchronizing"  type="warning"  >
                        Sincronizzare gli archivi
                    </v-alert>

                </div>

            </v-flex>
            <v-flex>
              <v-btn slot="right" @click="importAll"  :disabled="!syncBtnVisible" :loading="synchronizing">
                <span>Sincronizza</span>
                <v-icon>mdi-database-sync</v-icon>
            </v-btn>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import Panel from '../Containers/Panel'

  export default {
    components: {Panel},
    methods: {
      ...mapActions('sync', ['importAll'])
    },
    computed: {
      ...mapState('sync', ['updatingStatus', 'statusUpdated', 'dbStatus', 'synchronized', 'synchronizing']),
      syncBtnVisible () {
        if(this.synchronized) return false
        if(this.updatingStatus) return false
        return true
      }
    }
  }
</script>

<style scoped>

</style>
