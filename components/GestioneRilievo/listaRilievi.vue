<template>
  <div class="mainContainer">
    <v-container :style="`height:${getHeight}px`">
      <v-list>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in listRilievi" :key="i" @click="apriRilievo(item._id)">
            <v-list-item-content>
              <v-list-item-title v-text="item.descrizione"></v-list-item-title>
              <v-list-item-subtitle> {{ item.utente }} - {{ item.dataCreazione | dmy }}</v-list-item-subtitle>

              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-container class="fill-height" v-if="listRilievi == null || listRilievi.length == 0">
        <v-row align="center">
          <v-col cols="12" sm="8" class="mx-auto">
            <v-img :src="require('../../assets/images/rilievo-empty-list.png')" aspect-ratio="5" contain class="mb-5"></v-img>

            <p class="title text-center">Nessun rilievo</p>
            <p class="caption font-weight-light text-center" style="margin-top: -20px;">
              Inizia cliccando sul pulsante qui in basso
            </p>
          </v-col>
        </v-row>
      </v-container>

      <v-btn absolute rounded dark bottom right color="primary" @click="creaNuovoRilievo"> Crea rilievo <v-icon>mdi-plus</v-icon> </v-btn>
    </v-container>

    <v-dialog :value="showNewRilievo" persistent max-width="400px">
     <EditForm @onAbort="annullaModifiche" @onSave="salvaModifiche" :rilievo="rilievo" />
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
import EditForm from '@/components/gestione_rilievo/editForm'
import Vue from 'vue'

export default Vue.extend({
  props: {
    rifLavoroID: { default: null }
  },
  data() {
    return {
      showNewRilievo: false,
      rilievo: {}
    }
  },
  components: {
    EmptyList,
    EditForm
  },
  computed: {
    ...mapState('rilievo', { listRilievi: 'list', rilievo_old: 'record' }),
    ...mapState('auth', ['utente']),
    getHeight() {
      let offset = -10
      if (this.$el) offset = this.$el.offsetTop
      if (this.$vuetify.breakpoint.xsOnly) {
        return this.$vuetify.breakpoint.height - 220 //+ offset
      } else {
        return this.$vuetify.breakpoint.height - 300 //+ offset
      }
    }
  },
  methods: {
    ...mapMutations('rilievo', ['setRiferimentoAlLavoro']),
    ...mapMutations('rilievoModule', ['setRecord']),
    ...mapActions('rilievoModule', ['salva']),
    ...mapActions('rilievo', { loadRilievi: 'load', saveRilievo: 'save' }),
    apriRilievo(id) {
      this.$router.push(`/rilievo/${id}`)
    },
    creaNuovoRilievo() {
      this.showNewRilievo = true
      // this.$router.push(`/rilievo/add`)
    },
    annullaModifiche() {
      this.showNewRilievo = false
    },
    async salvaModifiche() {
      let rilievoRecord = {
        lavoroID: this.rifLavoroID,
        descrizione: this.rilievo.descrizione,
        note: this.rilievo.note,
        dataConsegna: this.rilievo.dataConsegna,
        tipo: this.rilievo.tipo,
        dataCreazione: new Date(),
        utente: this.utente
      }

      this.setRecord(rilievoRecord)
      let { id } = await this.salva()

      // this.rilievo._id = ''
      // const id = await this.saveRilievo()
      this.$router.push(`/rilievo/${id}`)
    }
  },
  mounted() {
    if (this.rifLavoroID) {
      this.setRiferimentoAlLavoro(this.rifLavoroID)
      this.loadRilievi()
    }
  }
})
</script>
