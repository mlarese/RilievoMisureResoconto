<template>
  <div>
    <v-container>
      <ListaUtenti :utenti="utenti" />
    </v-container>
  </div>
</template>

<script>
import ListaUtenti from '../../components/gestione_utenti/Lista'

export default {
  components: {
    ListaUtenti
  },
  async asyncData({ store }) {
    const url = `api/users/getAllUsers`
    const { data } = await store.dispatch('api/get', { url }, { root: true })
    return { utenti: data }
  }
}
</script>