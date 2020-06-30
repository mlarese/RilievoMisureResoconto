<template>
  <div>
    <v-simple-table fixed-header height="80vH">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Codice</th>
            <th class="text-left">Descrizione</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(usr, i) in utenti" :key="i" @click="onEdit(usr)">
            <td>{{ usr.codice }}</td>
            <td>{{ usr.descrizione }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-btn fab color="primary" class="mx-2 mb-12" dark fixed absolute bottom right @click="onAdd">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

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
            <v-form v-model="datiCorretti">
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
              ></v-text-field>
              <v-text-field
                ref="password1"
                v-model="utente.password"
                type="password"
                label="Password"
                @change="matchPassword()"
                :error="passwordMatchError"
                :rules="[rules.min8]"
              ></v-text-field>
              <v-text-field
                ref="password2"
                v-model="utente.passwordRepeated"
                type="password"
                label="Ripeti password"
                @change="matchPassword()"
                :error="passwordMatchError"
                :rules="[rules.min8]"
              ></v-text-field>
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
.mainContainer {
  height: 100%;
}
</style>

<script>
import { mapActions } from 'vuex'

export default {
  props: { utenti: { default: [] } },
  data: () => ({
    isAdd: false,
    isEdit: false,
    datiCorretti: false,
    passwordMatchError: false,

    utente: {
      codice: '',
      descrizione: '',
      username: '',
      password: '',
      passwordRepeated: ''
    },

    rules: {
      required: (value) => !!value || 'Campo obbligatorio',
      min4: (value) => value.length > 3 || 'Deve avere almeno 4 caratteri',
      min8: (value) => ((value) && value.length > 7) || 'Deve avere almeno 8 caratteri',
      noSpecial: (value) => {
        const pattern = /^[A-Za-z0-9_-]*$/
        return pattern.test(value) || 'Non sono consentiti caratteri speciali'
      }
    }
  }),
  methods: {
    ...mapActions('api', ['post', 'get']),
    onAdd() {
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

        const { data } = await get({ url: `api/users/getAllUsers` })
        this.utenti = data

        this.isAdd = this.isEdit = false
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