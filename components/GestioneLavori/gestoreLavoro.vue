<template>
  <div>
    <DxButton @click="btnNuovoLavoro" text="Nuovo lavoro" />
    <DxButton @click="btnCercaLavoro" text="Cerca lavoro" />
    <v-btn @click="btnNuovoLavoro">Esci</v-btn>
    <v-btn @click="btnCercaLavoro">Esci</v-btn>
    <ucElencolavori v-if="modalita === 'FIND'"></ucElencolavori>
    <ucEditlavori v-if="modalita === 'INSERT'"></ucEditlavori>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ucElencolavori from '~/components/GestioneLavori/lavoriFind'
import ucEditlavori from '~/components/GestioneLavori/lavoroEdit'
import { DxButton } from 'devextreme-vue'

export default {
  components: {
    ucElencolavori,
    ucEditlavori,
    DxButton
  },
  computed: {
    ...mapState('GestioneLavori/DM_Lavori', ['modalita'])
  },
  methods: {
    ...mapActions('GestioneLavori/DM_Lavori', ['impostaModalitaVisualizzazione']),
    btnNuovoLavoro() {
      console.log('INSERT')
      this.impostaModalitaVisualizzazione('INSERT')
    },
    btnCercaLavoro() {
      console.log('FIND')
      this.impostaModalitaVisualizzazione('FIND')
    }
  }
}
</script>