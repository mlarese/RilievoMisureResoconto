<template>
  <div>
    <ListLavori />
  </div>
</template>

<script>
import ListLavori from '../../components/GestioneLavori/Lista'

export default {
  components: {
    ListLavori
  },
  async fetch({ store }) {
    // store.dispatch('gestione_lavori/load', {}, { root: true })

    const all = [
      store.dispatch('gestione_lavori/load', {}, { root: true })
    ]

    await Promise.all(all)
  }
}
</script>
