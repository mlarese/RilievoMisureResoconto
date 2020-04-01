<!--eslint-disable-->
<template>
    <v-layout align-center justify-center class="login mt-5" >
        <v-flex xs12 sm8 md5 class="pa-3">
            <v-card class="elevation-6 pt-0 px-3 mx-5 opacity70" style="border-radius: 8px">
                <v-card-text>

                    <div class="text-xs-center mb-4">
                        <!-- img src="images/splash.jpg" alt="logo c2sms" width="240" class="ml-4" -->
                    </div>
                    <v-form>
                        <v-text-field dark prepend-icon="mdi-account" v-model="username" label="Login" type="text"></v-text-field>
                        <v-text-field dark  prepend-icon="mdi-lock" @keyup.enter="login" v-model="password" label="Password" id="password" type="password"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pb-4">
                    <v-spacer></v-spacer>
                    <v-btn small text style="whidth:80px" dark _loading="loading" class="mr-2 px-5" :disabled="!canLogin" color="" @click="login" @keyup.enter="login" medium>
                        Login

                    </v-btn>

                </v-card-actions>

            </v-card>
        </v-flex>
    </v-layout>

</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {notifyError} from '../../storeimp/api/actions'
  const schema = 'prod'

  export default {
    components: {},
    data () {
      return {
        error: null,
        username: '',
        password: '',
        alert: null,
        unverified: false,
        showReset: false,
        loading: false
      }
    },
    computed: {
      ...mapState('app', ['title']),
      ...mapState('api', ['isAjax']),
      ...mapState('auth', ['loggedIn']),
      canLogin () {
        if (!this.username) {
          return false
        }
        if (!this.password) {
          return false
        }

        return true
      }
    },
    mounted () {
      // debugger // eslint-disable-line
      // console.log('debug')
    },
    methods: {
      ...mapActions('auth', ['doLogin']),
      onResetPassword (user) {

      },
      async login () {
        this.error = null
        this.loading = true
        this.doLogin({username: this.username, password: this.password})
          .then(()=>{
            if(this.loggedIn) {
              this.$router.push('/')
            }
          })
      }
    }
  }
</script>
<style lang="scss">
    .opacity70{   background: rgba(46,44,44,.7) !important  }

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
