<template>
    <Panel title="Sincronizzazione">
        <v-layout rows wrap class="pt-2">
            <v-flex x12 class="text-xs-center">
                <v-layout rows wrap>
                    <v-flex class="pa-0 ma-0" xs12 v-if="key!='auth'" v-for="(db, key, index) in dbStatus" :key="key">
                            <v-icon>mdi-dns</v-icon>    {{key}}: {{db.doc_count}} records
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="dx-toolbar-center mt-5">
                <div>
                    <!-- v-alert dense :value="synchronized"  type="success"  >
                        Gli archivi sono sincronizzati
                    </v-alert -->

                    <v-alert dense :value="!synchronized"  type="warning"  >
                        Sincronizzare gli archivi
                    </v-alert>

                </div>

            </v-flex>
        </v-layout>
        <BottomNavigation>
            <v-btn slot="right" @click="importAll"  :disabled="!syncBtnVisible" :loading="synchronizing">
                <span>Sincronizza</span>
                <v-icon>mdi-sync</v-icon>
            </v-btn>
        </BottomNavigation>
    </Panel>
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
