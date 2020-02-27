<template>
    <GridContainer title="Gestione Lavori">
        <Grid slot="body-center" />
        <v-btn absolute small dark fab bottom right color="pink" class="cursor-pointer" >
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </GridContainer>
</template>

<script>
  import GridContainer from '../../components/Containers/GridContainer'
  import Grid from '../../components/GestioneLavori/Grid'
  export default {
    components: {GridContainer, Grid},
    props: []
  }
</script>
