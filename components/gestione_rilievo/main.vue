<template>
  <div>
    <Panel>
      <div slot="toolbarTitle">
        <div v-if="$vuetify.breakpoint.xsOnly">
          <b>{{ record.descrizione }}</b>
          <v-spacer></v-spacer>
        </div>
        <div v-else>Gestione rilievo</div>
      </div>

      <div slot="mainContent">
        <div v-if="$vuetify.breakpoint.smAndUp">
          <p>{{ record.descrizione }}</p>
          <v-divider></v-divider>
        </div>

        <v-tabs centered>
          <v-tab>SCHEDE</v-tab>
          <v-tab>FORI</v-tab>

          <v-tab-item :class="$vuetify.breakpoint.xsOnly ? 'c_small' : 'c_large'">
            <!-- SCHEDE - dati generali -->
            <schede />
          </v-tab-item>

          <v-tab-item :class="$vuetify.breakpoint.xsOnly ? 'c_small' : 'c_large'">
            <!-- FORI - posizioni -->
            <fori />
          </v-tab-item>
        </v-tabs>
      </div>
    </Panel>

    <!-- Wizard per dati generali -->
    <v-dialog
      v-model="ui.visualizzaWizardSchede"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="700px"
      @onExit="chiudiWizardSchede"
      @onSave="salvaArticoloGenerale"
    >
      <wizardSchede />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'

import Panel from '../Containers/Panel.vue'
import Schede from '../gestione_rilievo/schede.vue'
import Fori from '../gestione_rilievo/fori.vue'
import wizardSchede from '@/components/GestioneRilievo/wizardSchede.vue'

import { getRilievoModule } from '~/store'
import { RilievoRecord } from '~/store/rilievoModule'

@Component({ components: { Panel, Schede, Fori, wizardSchede }, name: 'rilievo' })
export default class RilievoMain extends Vue {
  get record() {
    return getRilievoModule(this.$store).record
  }
  get ui() {
    return getRilievoModule(this.$store).ui
  }

  salvaArticoloGenerale() {
    console.log('salvato')
  }

  chiudiWizardSchede() {
    this.ui.visualizzaWizardSchede = false
  }

  @Prop({ type: String, default: '' }) readonly id!: string

  mounted() {
    this.$store.dispatch('rilievoModule/loadByID', this.id, { root: true })
  }
}
</script>

<style scoped>
.c_small {
  height: calc(100vh - 110px);
  overflow: auto;
}
.c_large {
  min-height: 200px;
  max-height: calc(100vh - 250px);
  overflow: auto;
}
</style>