
<template>
  <v-layout align-center justify-center>
    <!-- SOLO SMARTPHONE PORTRAIT -->
    <v-flex class="loginSmall text-center" v-if="$vuetify.breakpoint.xsOnly">
      <v-card
        class="elevation-12"
        style="border-radius: 8px; background-color: #448aff"
      >
        <div class="panelSmall pt-12" >
          <v-avatar size="70">
            <img src="~/assets/images/logoSolo.png" />
          </v-avatar>
          <h1 class="my-2">AgileWork</h1>
          <h5>
            Powered by
            <a
              style="color: whitesmoke !important;"
              href="http://www.4innovation.srl"
              >4innovation.srl</a
            >
          </h5>
        </div>
        <v-card class="elevation-0" style="border-radius: 16px 16px 8px 8px">
          <v-card-text>
            <v-form ref="loginForm" v-model="formValid">
              <v-text-field
                prepend-icon="mdi-account"
                v-model="username"
                placeholder="Utente@Azienda"
                type="text"
                :rules="[rules.required, rules.username]"
                :disabled="loading"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                @keyup.enter="login"
                v-model="password"
                placeholder="Password"
                :rules="[rules.required]"
                id="password"
                :disabled="loading"
                :append-icon="cript ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                @click:append="() => (cript = !cript)"
                :type="cript ? 'password' : 'text'"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pb-4">
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2"
              outlined
              :loading="loading"
              :disabled="loading"
              color="info"
              @click="login"
            >
              accedi
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
              <v-icon right dark>mdi-login</v-icon>
            </v-btn>
          </v-card-actions>
          <v-alert
            type="error"
            dense
            class="mb-0"
            transition="scroll-y-transition"
            :value="isError"
          >
            {{ error }}
          </v-alert>
        </v-card>
      </v-card>
    </v-flex>

    <!-- LANDSCAPE e OLTRE -->
    <v-flex class="loginBig text-center" v-if="$vuetify.breakpoint.smAndUp">
      <v-card
        class="elevation-12"
        style="border-radius: 8px; background-color: #448aff"
      >
        <v-row>
          <v-col cols="6">
            <div class="panelBig pt-8">
              <v-avatar size="70">
                <img src="~/assets/images/logoSolo.png" />
              </v-avatar>
              <h1 class="my-2">AgileWork</h1>
              <h5>
                Powered by
                <a
                  style="color: whitesmoke !important;"
                  href="http://www.4innovation.srl"
                  >4innovation.srl</a
                >
              </h5>
            </div>
          </v-col>
          <v-col cols="6" class="ma-0 pa-0">
            <v-card
              class="elevation-0"
              style="border-radius: 16px 8px 8px 16px"
            >
              <v-card-text class="pb-0">
                <v-form ref="loginForm" v-model="formValid">
                  <v-text-field
                    prepend-icon="mdi-account"
                    v-model="username"
                    placeholder="Utente@Azienda"
                    type="text"
                    :rules="[rules.required, rules.username]"
                    :disabled="loading"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    @keyup.enter="login"
                    v-model="password"
                    placeholder="Password"
                    :rules="[rules.required]"
                    id="password"
                    :disabled="loading"
                    :append-icon="
                      cript ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                    "
                    @click:append="() => (cript = !cript)"
                    :type="cript ? 'password' : 'text'"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                <v-btn
                  class="ma-2"
                  outlined
                  :loading="loading"
                  :disabled="loading"
                  color="info"
                  @click="login"
                >
                  accedi
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                  <v-icon right dark>mdi-login</v-icon>
                </v-btn>
              </v-card-actions>
              <v-alert
                type="error"
                dense
                class="mb-0"
                transition="scroll-y-transition"
                :value="isError"
              >
                {{ error }}
              </v-alert>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style lang="scss">
.loginSmall {
  max-width: 350px;
}

.loginBig {
  max-width: 600px;
}

.panelSmall {
  background: #448aff !important;
  height: 35vh;
  vertical-align: middle;
}

.panelBig {
  background: #448aff !important;
  vertical-align: middle;
}

h1 {
  color: white;
}

h5 {
  color: whitesmoke;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.login {
  .icon {
    align-items: center;
    display: inline-flex;
    font-size: 20px !important;
    vertical-align: bottom;
  }

  .input-group--text-field input {
    height: 40px !important ;
  }
}
</style>

<script>
import { mapState, mapActions } from 'vuex'
const schema = 'prod'

export default {
  components: {},
  data() {
    return {
      formValid: false,
      error: null,
      isError: false,
      username: '',
      password: '',
      alert: null,
      loading: false,
      cript: true,
      rules: {
        required: (value) => !!value || 'Campo obbligatorio.',
        username: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@([a-zA-Z\-0-9]{3,})$/
          return (
            pattern.test(value) || 'Combinazione utente@azienda non valida.'
          )
        }
      }
    }
  },
  computed: {
    ...mapState('app', ['title']),
    ...mapState('api', ['isAjax']),
    ...mapState('auth', ['loggedIn'])
  },
  methods: {
    ...mapActions('auth', ['doLogin']),
    onResetPassword(user) {},

    async login() {
      this.$refs.loginForm.validate()
      if (!this.formValid) {
        this.error = 'Verificare i dati inseriti'
        this.isError = true
        return
      }

      this.isError = false
      this.error = null
      this.loading = true

      let nomeUtente = this.username.split('@')[0]
      let azienda = this.username.split('@')[1]

      this.doLogin({
        azienda: azienda,
        username: nomeUtente,
        password: this.password
      })
        .then(() => {
          if (this.loggedIn) {
            this.$router.push('/')
          } else {
            this.loading = false
            // NON DOVREBBE MAI PRESENTARSI
            this.error = 'Errore imprevisto'
            this.isError = true
          }
        })
        .catch((err) => {
          this.loading = false
          if (err && err.response && err.response.data) {
            this.error = err.response.data.message
          } else {
            this.error = 'Verificare la connessione'
          }
          this.isError = true
        })
    }
  }
}
</script>
