<template>
  <v-container class="pa-8">
    <v-input
      persistent-hint
      hint="Committente"
      prepend-icon="mdi-account-tie"
      class="py-2"
      >{{ $record.data.GL_CommittenteDesc }}
    </v-input>
    <v-input
      persistent-hint
      hint="Descrizione lavori"
      prepend-icon="mdi-message-bulleted"
      class="py-2"
      >{{ $record.data.GL_Oggetto }}
    </v-input>
    <v-input
      v-if="$record.data.GL_Indirizzo"
      persistent-hint
      hint="Indirizzo"
      prepend-icon="mdi-navigation"
      class="py-2"
      ><a @click="apriMaps($record.data.GL_Indirizzo)">{{
        $record.data.GL_Indirizzo
      }}</a>
    </v-input>
    <v-input
      v-if="$record.data.GL_Telefono"
      persistent-hint
      hint="Telefono"
      prepend-icon="mdi-phone"
      class="py-2"
      ><a :href="`tel:${$record.data.GL_Telefono}`">{{
        $record.data.GL_Telefono
      }}</a>
    </v-input>
    <v-input
    v-if="$record.data.GL_Note"
      persistent-hint
      hint="Note"
      prepend-icon="mdi-note-text-outline"
      class="py-2"
      >{{ $record.data.GL_Note }}
    </v-input>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

const storeName = 'gestione_lavori'

export default {
  computed: {
    ...mapState(storeName, ['$record'])
  },
  methods: {
    apriMaps(indirizzo) {
      if (indirizzo == '') {
        return
      }

      if (
        navigator.platform.indexOf('iPhone') != -1 ||
        navigator.platform.indexOf('iPad') != -1 ||
        navigator.platform.indexOf('iPod') != -1
      ) {
        /* if we're on iOS, open in Apple Maps */
        window.open(
          'maps://maps.google.it/maps/place/' + indirizzo.replace(' ', '+')
        )
      } else {
        /* else use Google */
        window.open(
          'https://www.google.it/maps/place/' + indirizzo.replace(' ', '+')
        )
      }
    }
  }
}
</script>
