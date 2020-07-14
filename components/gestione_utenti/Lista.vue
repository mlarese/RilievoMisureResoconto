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
                />
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- LISTA UTENTI -->
        <v-container :style="fillHeightStyle" class="py-0 px-1">
          <v-row dense>
            <v-col v-for="usr in getfilteredList()" :key="usr.codice" xs="12" md="6" lg="6">
              <v-card color="white" @click="onEdit(usr)" min-width="300" max-height="200">
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
                <v-card-actions class="py-0">
                  <v-icon
                    v-if="!usr.abilitato"
                    color="primary"
                    class="align-self-end pa-1"
                  >mdi-account-off-outline</v-icon>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
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
  props: { utenti: { default: [] } },
  data: () => ({
    isAdd: false,
    isEdit: false,
    datiCorretti: false,
    passwordMatchError: false,
    filterText: '',
    fillHeightStyle: '',

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
      return _filter(this.utenti, function(o) {
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
    },
    onAdd() {
      this.utente = nuovoUtente
      this.isAdd = true
    },
    onEdit(usr) {
      this.utente = usr
      this.isEdit = true
    },
    annullaModifiche() {
      this.isAdd = false
      this.isEdit = false
    },
    async salvaModifiche() {
      try {
        const url = 'api/users/saveUser'
        const resSave = await this.post({ url, data: this.utente })
        console.log(resSave)

        const { data } = await this.get({ url: `api/users/getAllUsers` })
        this.utenti = data

        this.isAdd = false
        this.isEdit = false
      } catch (error) {
        // Dovrà essere stampato da qualche parte
        console.error()
      }
    },
    matchPassword(v) {
      let value1 = this.$refs['password1'].value
      let value2 = this.$refs['password2'].value
      this.passwordMatchError = !(value1 == value2)
    }
  }
}
</script>