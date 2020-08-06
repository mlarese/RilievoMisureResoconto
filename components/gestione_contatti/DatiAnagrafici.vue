<template>
  <v-container class="pa-8">
    <v-input
      persistent-hint
      hint="Descrizione"
      prepend-icon="mdi-account-tie"
      class="py-2"
      >{{ $record.data.CONDescrizione }}
    </v-input>
    <v-input
      v-if="$record.data.CONIndirizzo"
      persistent-hint
      hint="Indirizzo"
      prepend-icon="mdi-navigation"
      class="py-2"
      ><a @click="apriMaps($record.data.CONIndirizzo)">{{
        $record.data.CONIndirizzo
      }}</a>
    </v-input>
    <v-input
      v-if="$record.data.CONTelefono"
      persistent-hint
      hint="Telefono"
      prepend-icon="mdi-phone"
      class="py-2"
      ><a :href="`tel:${$record.data.CONTelefono}`">{{
        $record.data.CONTelefono
      }}</a>
    </v-input>
    <v-input
    v-if="$record.data.CONNote"
      persistent-hint
      hint="Note"
      prepend-icon="mdi-note-text-outline"
      class="py-2"
      >{{ $record.data.CONNote }}
    </v-input>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

const storeName = 'gestione_contatti'

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
