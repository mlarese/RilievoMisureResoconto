<template>
  <GridContainer title="Rilievo">
    <GridRilievo slot="body-center" />
  </GridContainer>
</template>

<script>
import GridContainer from '../../components/Containers/GridContainer'
import GridRilievo from '../../components/GestioneRilievo/Rilievo'
export default {
  components: { GridContainer, GridRilievo },
  props: [],
  fetch({ store, params }) {
    store.commit('rilievo/setRiferimentoAlLavoro', params.id,  {root: true})
    store.dispatch('rilievo/load', { root: true })
  }
}
</script>
