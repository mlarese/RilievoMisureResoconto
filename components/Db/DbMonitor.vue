<template>
    <v-card class="pa-5">
        <v-card-title>Sincronizzazione</v-card-title>
        <v-layout rows wrap class="py-0" >
            <!-- <v-flex x12 class="text-xs-center py-0">
                <v-layout rows wrap >
                    <v-flex class="py-0 px-2 ma-0" xs12 v-for="(db, key) in dbStatus" :key="key">
                            <v-icon v-if="synchronized">mdi-database-check</v-icon>
                            <v-icon v-else>mdi-database-remove</v-icon>
                            {{key}}
                    </v-flex>
                </v-layout>
            </v-flex> -->
            <!-- <v-flex xs12 class="dx-toolbar-center mt-5">
                <div>
                    <v-alert dense :value="!synchronized && !synchronizing"  type="warning"  >
                        Sincronizzare gli archivi
                    </v-alert>
                </div>

            </v-flex> -->
            <v-flex xs12>
              <v-textarea
                v-model="syncLog"
                label="Log"
                dense
                readonly
              />
            </v-flex>
            <v-flex>


              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    @click="importAll"  :disabled="!syncBtnVisible" :loading="synchronizing">
                    <span>download</span>
                    <v-icon>mdi-database-sync</v-icon>
                  </v-btn>
                </template>
                <span>Download dei dati da server</span>
              </v-tooltip>

            <v-btn slot="right" @click="exportAll"  :disabled="!syncBtnVisible" :loading="synchronizing">
                <span>upload</span>
                <v-icon>mdi-database-sync</v-icon>
            </v-btn>
            <v-btn slot="right" @click="syncRisorse"  :disabled="!syncBtnVisible" :loading="synchronizing">
                <span>risorse</span>
              <v-btn slot="right" @click="syncAll"  :disabled="synchronizing" :loading="synchronizing">
                <span>Sincronizza</span>
                <v-icon>mdi-database-sync</v-icon>
            </v-btn>

              <v-btn slot="right" @click="syncAppuntiDemo"  :disabled="!syncBtnVisible" :loading="synchronizing">
                <span>appunti demo</span>
                <v-icon>mdi-database-sync</v-icon>
              </v-btn>

            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import Panel from '../Containers/Panel'
  import appuntimmJson from '../../storeimp/fixtures/appuntimm.json'
  export default {
    components: {Panel},
    methods: {
      ...mapActions('sync', ['syncAll'])
      ...mapActions('sync', ['importAll', 'exportAll', 'syncRisorse']),
      ...mapActions('appuntimm', ['setDemo']),
      syncAppuntiDemo () {
        this.setDemo(appuntimmJson)
      }
    },
    computed: {
      ...mapState('sync', ['synchronizing', 'syncLog'])
    }
  }
</script>

<style scoped>

</style>
