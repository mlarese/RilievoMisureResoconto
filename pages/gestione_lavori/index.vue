<template>

  <List/>

</template>

<script>
import List from '../../components/GestioneLavori/List'

export default {
  components: {
    List
  },
  fetch ({store}) {
    store.dispatch('gestione_lavori/load', {},  {root: true})
  }
}
</script>
