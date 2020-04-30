<template>
  <CardPanel :sliderVisible="false">
    <card slot="back">
      <v-card-text>
        <div>
          <v-text-field
            v-model="utente"
            label="Utente"
            required
            dense
            outlined
            readonly
          ></v-text-field>
          <v-text-field
            v-model="azienda"
            label="Azienda"
            required
            dense
            outlined
            readonly
          ></v-text-field>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="logout">
          logout
        </v-btn>
      </v-card-actions>
    </card>
  </CardPanel>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CardPanel from '../components/Containers/Panel'
export default {
  layout: 'fullPage',
  fetch({ store }) {
    store.dispatch('auth/persistentUser', {}, { root: true })
  },
  components: {
    CardPanel
  },
  computed: {
    ...mapState('auth', ['utente', 'azienda'])
  },
  methods: {
    ...mapActions('auth', ['doLogout']),
    logout() {
      this.doLogout()
        .then()
        .then(() => {
          this.$router.push('/')
        })
    }
  }
}
</script>
