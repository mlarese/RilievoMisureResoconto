<template>
  <div class="mainContainer">
    <v-container>
      <v-card
        v-for="rilievo in listRilievi"
        :key="rilievo._id"
        @click="apriRilievo(rilievo._id)"
        outlined
        class="mb-2"
      >
        <v-card-text>
          <div class="title">
            {{ rilievo.descrizione }}
          </div>
          <div>
            {{ rilievo.dataCreazione }}
          </div>
        </v-card-text>
      </v-card>
      <EmptyList
        v-if="listRilievi == null || listRilievi.lenght == 0"
        :title="'Nessun rilievo'"
        :subtitle="'Premere il pulsante in basso per aggiungerne uno nuovo'"
      />
      <v-btn
        absolute
        fab
        dark
        bottom
        right
        class="mb-10"
        color="primary"
        @click="creaNuovoRilievo()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<style scoped>
.mainContainer {
  height: 100%;
}
</style>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import EmptyList from '../General/EmptyList'

export default {
  props: {
    rifLavoroID: { default: null }
  },
  components: {
    EmptyList
  },
  computed: {
    ...mapState('rilievo', { listRilievi: 'list' })
  },
  methods: {
    ...mapMutations('rilievo', ['setRiferimentoAlLavoro']),
    ...mapActions('rilievo', { loadRilievi: 'load' }),
    apriRilievo(id) {
      this.$router.push(`/rilievo/${id}`)
    },
    creaNuovoRilievo() {
      this.$router.push(`/rilievo/add`)
    }
  },
  mounted() {
    if (this.rifLavoroID) {
      this.setRiferimentoAlLavoro(this.rifLavoroID)
      this.loadRilievi()
    }
  }
}
</script>
