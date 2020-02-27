<template>

    <DxDataGrid
      id="xdgvElencoLavori"
      :data-source="list"
      :show-borders="true"
    >
      <DxColumn data-field="GL_Committente" caption="Committente" />
      <DxColumn  data-field="GL_Descrizione"  caption="Descrizione"  />
      <DxColumn data-field="GL_Indirizzo"   caption="Indirizzo"   />
    </DxDataGrid>

</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { DxDataGrid, DxColumn, DxEditing } from 'devextreme-vue/data-grid'
import { DxButton } from 'devextreme-vue'

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxButton
  },
  computed: {
    ...mapState('gestione_lavori', ['list'])
  }
}
</script>
