<template>
  <div>
    <!-- <GridContainer :title="ui.title">
      <Grid slot="body-center" :show-filter="showFilter" />
    </GridContainer> -->

    <ListLavori/>

  </div>
</template>

<script>
import GridContainer from '../../components/Containers/GridContainer'
import Grid from '../../components/gestione_lavori/Grid'
import ListLavori from "../../components/gestione_lavori/Lista"
import { mapState, mapGetters } from 'vuex'
export default {
  components: { GridContainer, Grid, ListLavori },
  data() {
    return {
      showFilter: false
    }
  },
  methods: {
    onAdd() {
      this.$router.push(`/gestione_lavori/add`)
    }
  }
}
</script>
