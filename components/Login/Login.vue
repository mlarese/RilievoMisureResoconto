<!--eslint-disable-->
<template>
  <v-layout align-center justify-center>
    <!-- SOLO SMARTPHONE PORTRAIT -->
    <v-flex class="loginSmall" v-if="$vuetify.breakpoint.xsOnly">
      <v-card
        class="elevation-12"
        style="border-radius: 8px; background-color: #448aff"
      >
        <div class="panelSmall pt-12">
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
            <v-form>
              <v-text-field
                prepend-icon="mdi-account-group"
                v-model="azienda"
                label="Azienda"
                type="text"
                :disabled="loading"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-account"
                v-model="username"
                label="Utente"
                type="text"
                :disabled="loading"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                @keyup.enter="login"
                v-model="password"
                label="Password"
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
              small
              @click="login"
            >
              accedi
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>cached</v-icon>
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
            :value="error"
          >
            {{ error }}
          </v-alert>
        </v-card>
      </v-card>
    </v-flex>

    <!-- LANDSCAPE e OLTRE -->
    <v-flex class="loginBig" v-if="$vuetify.breakpoint.smAndUp">
      <v-card
        class="elevation-12"
        style="border-radius: 8px; background-color: #448aff"
      >
        <v-row>
          <v-col cols="6">
            <div class="panelBig pt-12">
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
                <v-form>
                  <v-text-field
                    prepend-icon="mdi-account-group"
                    v-model="azienda"
                    label="Azienda"
                    type="text"
                    :disabled="loading"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-account"
                    v-model="username"
                    label="Utente"
                    type="text"
                    :disabled="loading"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    @keyup.enter="login"
                    v-model="password"
                    label="Password"
                    id="password"
                    :disabled="loading"
                    :append-icon="cript ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
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
                  small
                >
                  accedi
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon light>cached</v-icon>
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
                :value="error"
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
  height: 40vh;
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
import { notifyError } from '../../storeimp/api/actions'
const schema = 'prod'

export default {
  components: {},
  data() {
    return {
      error: null,
      username: '',
      password: '',
      azienda: '',
      alert: null,
      unverified: false,
      showReset: false,
      loading: false,
      cript: true
    }
  },
  computed: {
    ...mapState('app', ['title']),
    ...mapState('api', ['isAjax']),
    ...mapState('auth', ['loggedIn']),
    canLogin() {
      if (!this.username) {
        return false
      }
      if (!this.password) {
        return false
      }
      if (!this.azienda) {
        return false
      }

      return true
    }
  },
  mounted() {
    // debugger // eslint-disable-line
    // console.log('debug')
  },
  methods: {
    ...mapActions('auth', ['doLogin']),
    onResetPassword(user) {},
    async login() {
      this.error = null
      this.loading = true
      this.doLogin({
        azienda: this.azienda,
        username: this.username,
        password: this.password
      })
        .then(() => {
          if (this.loggedIn) {
            this.$router.push('/')
          } else {
            this.loading = false
            // NON DOVREBBE MAI PRESENTARSI
            this.error = 'Errore imprevisto'
          }
        })
        .catch((err) => {
          this.loading = false
          if (this.error == null || err.response == null) {
            this.error = 'Verificare la connessione'
          } else {
            this.error = err.response.data.message
          }
        })
    }
  }
}
</script>
