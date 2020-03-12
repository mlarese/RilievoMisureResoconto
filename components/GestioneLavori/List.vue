<template>
    <GridContainer :title="ui.title">
        <Grid slot="body-center" />
        <v-btn absolute small dark fab bottom right color="pink" class="cursor-pointer" v-if="false">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </GridContainer>
</template>

<script>
  import GridContainer from '../../components/Containers/GridContainer'
  import Grid from '../../components/GestioneLavori/Grid'
  import {mapState} from 'vuex'
  export default {
    components: {GridContainer, Grid},
    computed: {
      ...mapState('gestione_lavori', ['ui'])
    },
    props: []
  }
</script>
