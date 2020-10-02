<template>
  <div class="mainContainer">
    <v-container>
      <!-- <v-card v-for="rilievo in listRilievi" :key="rilievo._id" @click="apriRilievo(rilievo._id)" class="mb-2">
        <v-card-text>
          <div class="title">{{ rilievo.descrizione }}</div>
          <div>{{ rilievo.dataCreazione }}</div>
        </v-card-text>
      </v-card> -->

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

      <EmptyList
        v-if="listRilievi == null || listRilievi.lenght == 0"
        :title="'Nessun rilievo'"
        :subtitle="'Premere il pulsante in basso per aggiungerne uno nuovo'"
      />
      <v-btn absolute fab dark bottom right class="mb-10" color="primary" @click="creaNuovoRilievo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-container>

    <v-dialog :value="showNewRilievo" persistent max-width="700px">
      <v-card>
        <v-toolbar dense dark="dark" color="primary">
          Nuovo rilievo
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-text-field v-model="rilievo.descrizione" label="Inserire una descrizione" required></v-text-field>

          <v-select v-model="rilievo.tipo" :items="tipiRilievo" hide-details label="Tipo rilievo" outlined dense item-text="value" item-value="key"></v-select>
        </v-card-text>

        <v-card-actions class="py-0">
          <v-card-subtitle>
            Avanzate
          </v-card-subtitle>
          <v-spacer></v-spacer>

          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text>
              <v-dialog ref="dialog" v-model="modal" :return-value.sync="rilievo.dataConsegna" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="rilievo.dataConsegna"
                    label="Data indicativa di consegna"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="rilievo.dataConsegna" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal = false">
                    Annulla
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.dialog.save(rilievo.dataConsegna)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-textarea hide-details clearable rows="2" clear-icon="mdi-close-circle" label="Annotazioni aggiuntive" v-model="rilievo.note"></v-textarea>
            </v-card-text>
          </div>
        </v-expand-transition>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="annullaModifiche()">Annulla</v-btn>
          <v-btn color="blue darken-1" text @click="salvaModifiche()">Crea</v-btn>
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
import Vue from 'vue'

export default Vue.extend({
  props: {
    rifLavoroID: { default: null }
  },
  data() {
    return {
      showNewRilievo: false,
      show: false,
      modal: false,
      tipiRilievo: [
        { key: 1, value: 'Preliminare' },
        { key: 2, value: 'Variante' },
        { key: 3, value: 'Definitivo' }
      ],
      rilievo: {}
    }
  },
  components: {
    EmptyList
  },
  computed: {
    ...mapState('rilievo', { listRilievi: 'list', rilievo_old: 'record' }),
    ...mapState('auth', ['utente'])
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
