<template>
  <div>
    <ListaUtenti :utenti="utenti" />
  </div>
</template>

<script>
import ListaUtenti from '../../components/gestione_utenti/Lista'

export default {
  layout: 'fullPage',
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