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
      <DxColumn data-field="committenteDesc" caption="Committente" />
      <DxColumn  data-field="descrizione"  caption="Descrizione"  />
      <DxColumn data-field="luogo"   caption="Indirizzo"   />

        <DxColumn
                :width="40"
                :allow-sorting="false"
                cell-template="commandsTemplate"
        />

        <template #commandsTemplate="cell">
            <DxButton
                    @click="onEdit(cell)"
                    icon="edit"
                    hint="Modifica lavoro"
            />
        </template>

        <DxSpeedDialAction
                :on-click="onAdd"
                :index="1"
                icon="add"
                :label="buttonAddTitle"
        />
    </DxDataGrid>

</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { DxDataGrid, DxColumn, DxEditing, DxFilterRow } from 'devextreme-vue/data-grid'
import { DxButton, DxSpeedDialAction } from 'devextreme-vue'

export default {
  components: {
    DxDataGrid,
    DxFilterRow,
    DxColumn,
    DxEditing,
    DxButton,
    DxSpeedDialAction
  },
  computed: {
    ...mapState('gestione_lavori', ['list']),
    ...mapGetters('gestione_lavori', ['modeTitle', 'buttonAddTitle'])
  },
  methods: {
    ...mapMutations('gestione_lavori', ['']),
    onEdit (cell) {
      const {_id} = cell.data.data
      this.$router.push(`/gestione_lavori/${_id}`)
    },
    onAdd () {
      this.$router.push(`/gestione_lavori/add`)
    }
  }
}
</script>
