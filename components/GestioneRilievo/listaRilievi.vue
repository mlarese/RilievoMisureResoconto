<template>
  <div class="mainContainer">
    <v-container>
      <v-card
        v-for="rilievo in listRilievi"
        :key="rilievo._id"
        @click="apriRilievo(rilievo._id)"
        class="mb-2"
      >
        <v-card-text>
          <div class="title">{{ rilievo.descrizione }}</div>
          <div>{{ rilievo.dataCreazione }}</div>
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

    <v-dialog :value="showNewRilievo" persistent max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">
            Gestione rilievo
          </span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="rilievo.descrizione"
            label="Descrizione"
            required
            dense
            class="py-2"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="annullaModifiche()">Annulla</v-btn>
          <v-btn color="blue darken-1" text @click="salvaModifiche()">Salva</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  data() {
    return {
      showNewRilievo: false
    }
  },
  components: {
    EmptyList
  },
  computed: {
    ...mapState('rilievo', { listRilievi: 'list', rilievo: 'record' })
  },
  methods: {
    ...mapMutations('rilievo', ['setRiferimentoAlLavoro']),
    ...mapActions('rilievo', { loadRilievi: 'load', saveRilievo: 'save' }),
    apriRilievo(id) {
      this.$router.push(`/rilievo/${id}`)
    },
    creaNuovoRilievo() {
      this.showNewRilievo = true
      // this.$router.push(`/rilievo/add`)
    },
    annullaModifiche(){
      this.showNewRilievo = false
    },
    async salvaModifiche(){
      const id = await this.saveRilievo()
      this.$router.push(`/rilievo/${id}`)
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
