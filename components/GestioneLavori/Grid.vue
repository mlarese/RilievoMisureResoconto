<template>

    <DxDataGrid
      id="xdgvElencoLavori"
      :data-source="list"
      :show-borders="true"
      keyExpr="uid"
      :focusedRowEnabled="true"
      :columnAutoWidth="true"
      noDataText="Nessun lavoro trovato"
    >
      <DxFilterRow :visible="true"/>
      <DxEditing :allow-updating="true"  mode="form" />
      <DxColumn data-field="committenteDesc" caption="Committente" />
      <DxColumn  data-field="descrizione"  caption="Descrizione"  />
      <DxColumn data-field="luogo"   caption="Indirizzo"   />

    </DxDataGrid>

</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { DxDataGrid, DxColumn, DxEditing, DxFilterRow } from 'devextreme-vue/data-grid'
import { DxButton } from 'devextreme-vue'

export default {
  components: {
    DxDataGrid,
    DxFilterRow,
    DxColumn,
    DxEditing,
    DxButton
  },
  computed: {
    ...mapState('gestione_lavori', ['list'])
  }
}
</script>
