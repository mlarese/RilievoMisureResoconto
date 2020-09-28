<template>
  <Rilievo />
</template>

<script>
// import Rilievo from '../../components/GestioneRilievo/Rilievo'
import Rilievo from '../../components/gestione_rilievo/main'

export default {
  layout: 'fullPage',
  components: { Rilievo },
  props: [],
  fetch({ store, params }) {
    store.commit('rilievo/setModalita', 'ADD',  {root: true})
    store.commit('rilievo/setEmptyRecord', {},  {root: true})
  }
}
</script>
