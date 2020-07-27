<template>
  <div>
    <Panel>
      <div slot="toolbarTitle">
        <b>Gestione utenti</b>
      </div>
      <v-container slot="mainContent" class="pb-0 ma-0">
        <!-- FILTRO -->
        <v-row dense>
          <v-col cols="12">
            <v-card class="elevation-0" height="50px">
              <div class="d-flex">
                <v-text-field
                  outlined
                  dense
                  label="Cerca utente..."
                  append-icon="search"
                  background-color="white"
                  v-model="filterText"
                  :loading="isLoadingList"
                />
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- LISTA UTENTI -->
        <v-container v-if="isOnline()" :style="fillHeightStyle" class="py-0 px-1">
          <v-row dense>
            <v-col v-for="(usr, i) in getfilteredList()" :key="i" xs="12" :sm="usr.header ? 12: 6">
              <v-card flat v-if="usr.header" min-width="300">
                <v-label>{{usr.header}}</v-label>
              </v-card>

              <v-card v-else color="white" @click="onEdit(usr)" min-width="300" max-height="200">
                <div class="d-flex flex-no-wrap">
                  <v-avatar class="mt-3 ml-3" size="60">
                    <v-img :src="usr.imgURL || require('../../assets/images/user.png')" />
                  </v-avatar>
                  <div class="flex-grow-1 flex-shrink-1">
                    <v-card-title
                      v-text="usr.descrizione"
                      class="headline"
                      style="word-break: normal;"
                    />
                    <v-card-subtitle v-text="usr.codice" />
                    <!-- <v-card-text v-text="usr.codice" /> -->
                  </div>
                </div>
                <!-- <v-card-actions class="py-0">
                  <v-icon
                    v-if="!usr.abilitato"
                    color="primary"
                    class="align-self-end pa-1"
                  >mdi-account-off-outline</v-icon>
                </v-card-actions>-->
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-container v-else class="d-flex" :style="fillHeightStyle" >
          <v-alert
            border="right"
            colored-border
            type="error"
            elevation="2"
            icon="mdi-wifi-off"
            class="align-self-center"
          >Questa funzionalità è disponibile solamente con connessione a internet.
          </v-alert>
        </v-container>

        <v-btn
          fab
          color="primary"
          class="mx-2 mb-12"
          dark
          fixed
          absolute
          bottom
          right
          @click="onAdd"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-container>
    </Panel>

    <v-dialog
      :value="isEdit || isAdd"
      persistent
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ isAdd ? 'Nuovo utente' : 'Modifica utente' }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form v-model="datiCorretti" autocomplete="off">
              <v-text-field
                v-model="utente.codice"
                :rules="[rules.required, rules.noSpecial, rules.min4]"
                label="Codice"
              ></v-text-field>
              <v-text-field
                v-model="utente.descrizione"
                :rules="[rules.required, rules.min4]"
                label="Nominativo"
              ></v-text-field>
              <v-text-field
                v-model="utente.username"
                :rules="[rules.required, rules.noSpecial, rules.min4]"
                label="Username"
                autocomplete="new-password"
              ></v-text-field>
              <v-text-field
                ref="password1"
                v-model="utente.password"
                type="password"
                label="Password"
                @change="matchPassword()"
                :error="passwordMatchError"
                :rules="[rules.min8]"
                autocomplete="new-password"
              ></v-text-field>
              <v-text-field
                ref="password2"
                v-model="utente.passwordRepeated"
                type="password"
                label="Ripeti password"
                @change="matchPassword()"
                :error="passwordMatchError"
                :rules="[rules.min8]"
                autocomplete="new-password"
              ></v-text-field>
              <v-checkbox
                v-model="utente.abilitato"
                :label="utente.abilitato ? 'Utente abilitato': 'Utente disabilitato'"
              ></v-checkbox>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="annullaModifiche()">Annulla</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="salvaModifiche()"
            :readonly="!datiCorretti"
            :loading="isLoadingSave"
          >Salva</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.ss {
  overflow-y: auto;
}
</style>

<script>
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _clone from 'lodash/clone'
import { mapActions } from 'vuex'
import Panel from '../Containers/Panel'

const nuovoUtente = {
  codice: '',
  descrizione: '',
  username: '',
  password: '',
  passwordRepeated: '',
  abilitato: true
}

export default {
  components: {
    Panel
  },
  // props: { utenti: { default: [] } },
  data: () => ({
    isLoadingList: true,
    isLoadingSave: false,

    isAdd: false,
    isEdit: false,
    datiCorretti: false,
    passwordMatchError: false,
    filterText: '',
    fillHeightStyle: '',
    utenti: [],
    utente: {},

    rules: {
      required: (value) => !!value || 'Campo obbligatorio',
      min4: (value) => value.length > 3 || 'Deve avere almeno 4 caratteri',
      min8: (value) =>
        (value && value.length > 7) || 'Deve avere almeno 8 caratteri',
      noSpecial: (value) => {
        const pattern = /^[A-Za-z0-9_-]*$/
        return pattern.test(value) || 'Non sono consentiti caratteri speciali'
      }
    }
  }),
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  methods: {
    onResize() {
      let top = 135
      if (this.$vuetify.breakpoint.smAndUp) top = 200

      let h = window.innerHeight - top
      this.fillHeightStyle = { height: `${h}px`, 'overflow-y': 'auto' }
    },
    ...mapActions('api', ['post', 'get']),
    ...mapActions('api', ['post', 'get']),
    getfilteredList() {
      let filter = this.filterText
      let listaFiltrata = []

      // Filtra la lista per filtro manuale
      listaFiltrata = _filter(this.utenti, function(o) {
        if (filter == '') {
          return true
        } else {
          return (
            (o.descrizione &&
              o.descrizione.toLowerCase().includes(filter.toLowerCase())) ||
            (o.codice && o.codice.toLowerCase().includes(filter.toLowerCase()))
          )
        }
      })
      // Ordina la lista per utente descrizione
      let listaAbil = []
      listaAbil = _orderBy(
        _filter(listaFiltrata, ['abilitato', true]),
        ['descrizione'],
        ['asc']
      )
      let listaDisab = []
      listaDisab = _orderBy(
        _filter(listaFiltrata, ['abilitato', false]),
        ['descrizione'],
        ['asc']
      )

      // Raggruppa gli utenti attivi e disattivati
      let res = []
      res.push({ header: `Attivi (${listaAbil.length})` })
      res.push(...listaAbil)
      res.push({ header: `Disabilitati (${listaDisab.length})` })
      res.push(...listaDisab)
      return res
    },
    onAdd() {
      this.utente = nuovoUtente
      this.isAdd = true
    },
    onEdit(usr) {
      this.utente = _clone(usr)
      this.isEdit = true
    },
    annullaModifiche() {
      this.isAdd = false
      this.isEdit = false
    },
    async salvaModifiche() {
      try {
        this.isLoadingSave = true
        const url = 'api/users/saveUser'
        const resSave = await this.post({ url, data: this.utente })
        console.log(resSave)

        await this.loadData()

        this.isLoadingSave = false
        this.isAdd = false
        this.isEdit = false
      } catch (error) {
        // Dovrà essere stampato da qualche parte
        this.isLoadingSave = false
        console.error(error)
      }
    },
    matchPassword(v) {
      let value1 = this.$refs['password1'].value
      let value2 = this.$refs['password2'].value
      this.passwordMatchError = !(value1 == value2)
    },
    async loadData() {
      this.isLoadingList = true
      const { data } = await this.get({ url: `api/users/getAllUsers` })
      this.utenti = data
      this.isLoadingList = false
    },
    isOnline(){
      return navigator.onLine == true
    }
  },
  created() {
    this.loadData()
  }
}
</script>