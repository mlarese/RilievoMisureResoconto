<template>
  <div>
    <GridRilievo />
    <popupPosEdit ref="popupPosEdit" />
    <BottomNavigation class="">
      <div slot="right">
        <!-- <v-btn @click="showFilter=!showFilter">
                    <span>Filtro</span>
                    <v-icon v-if="!showFilter">mdi-filter</v-icon>
                    <v-icon v-else>mdi-filter-remove</v-icon>
                </v-btn> -->

        <v-btn @click="apriNuovaPosizione()">
          <span>Nuovo</span>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </BottomNavigation>
  </div>
</template>

<script>
import GridRilievo from '../../components/GestioneRilievo/Rilievo'
import popupPosEdit from '../../components/GestioneRilievo/posizioneEdit'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { tr } from 'date-fns/locale'

export default {
  components: { GridRilievo, popupPosEdit },
  props: [],
  fetch({ store, params }) {
    store.commit('rilievo/setRiferimentoAlLavoro', params.id, { root: true })
    store.dispatch('rilievo/load', { root: true })
  },
  computed: {
    ...mapState('rilievo', { rilievo: 'record' })
  },
  methods: {
    apriNuovaPosizione() {
      this.$refs.popupPosEdit
        .open('Inserire una nuova posizione', '', 1)
        .then((data) => {
          if (data) {
            this.insertRow(data)
          }
        })
    },
    ...mapMutations('rilievoPos', ['setRecord']),
    ...mapActions('rilievoPos', {
      saveRow: 'save',
      deleteRow: 'deleteByID'
    }),
    insertRow(data) {
      let newPos = {}
      newPos.posizioneDesc = data.NomePosizione
      newPos.PosQta = data.QtaPosizione
      newPos.rilievoID = this.rilievo._id
      this.setRecord(newPos)
      this.saveRow()
    },
    updateRow({ data }) {
      console.log(data)
      this.setRecord(data)
      this.saveRow()
    },
    removeRow({ data }) {
      console.log(data._id)
      this.deleteRow(data._id)
    }
  }
}
</script>
