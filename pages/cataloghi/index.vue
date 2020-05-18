<template>
  <div>
    <v-layout rows wrap>
      <v-flex s6>
        <v-card>
          <v-card-title class="headline" style>Cataloghi</v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

export default {
  components: {
    
  },
  fetch({ store }) {
    store.dispatch('gestione_lavori/load', {}, { root: true })
  }
}
</script>
