<template>
  <Rilievo />
</template>

<script>
import Rilievo from '../../components/GestioneRilievo/Rilievo'

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
