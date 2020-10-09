<template>
  <v-container class="pa-8">
    <v-input persistent-hint hint="Descrizione" prepend-icon="mdi-tape-measure" class="py-2">
      {{ record.descrizione }}
    </v-input>

    <v-input v-if="record.tipo" persistent-hint hint="Tipo" prepend-icon="mdi-format-list-bulleted-type" class="py-2">
      {{ record.tipo }}
    </v-input>

    <v-input v-if="record.dataConsegna" persistent-hint hint="Data consegna prevista" prepend-icon="mdi-calendar-clock" class="py-2">
      {{ record.dataConsegna | dmy }}
    </v-input>

    <v-input persistent-hint hint="Note" prepend-icon="mdi-clipboard-text-outline" class="py-2">
      {{ record.note }}
    </v-input>

    <v-card-actions class="py-0 d-flex justify-center">
      <v-btn x-large dark outlined color="green" @click="apriWizardRilievo">
          <v-icon class="pr-2">mdi-tape-measure</v-icon>INIZIA RILIEVO</v-btn>
    </v-card-actions>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop, Action } from 'nuxt-property-decorator'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'

@Component({ components: {}, name: 'datiAnagrafici' })
export default class RilievoMain extends Vue {
  @State(state => state.rilievoModule.record) record!: RilievoRecord
  @State(state => state.rilievoModule.ui) ui!: RilievoUI

  apriWizardRilievo(){
      this.ui.visualizzaWizardRilievo = true
  }
}
</script>