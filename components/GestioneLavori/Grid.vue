<template>

    <div>
        <DxDataGrid
          id="xdgvElencoLavori"
          :data-source="noDeletedList"
          :show-borders="false"
          :show-column-lines="false"
          :show-row-lines="true"
          :row-alternation-enabled="true"
          keyExpr="uid"
          :columnAutoWidth="true"
          :column-hiding-enabled="false"
          noDataText="Nessun lavoro trovato"
          @row-dbl-click="onRowDblClick"
          _cell-click="onCellClick"
        >

            <DxColumn :width="80"  :allow-sorting="false"  cell-template="commandsTemplate"/>

            <DxColumn data-field="committenteDesc" caption="Committente" />
            <DxColumn data-field="descrizione"  caption="Descrizione"  />
            <DxColumn data-field="luogo"   caption="Indirizzo"   />

            <template #commandsTemplate="cell">
                <div>
                    <DxButton @click="onEdit(cell)" icon="edit" hint="Modifica lavoro" />
                    <DxButton @click="onDelete(cell)" icon="trash" hint="Cancella lavoro" />
                </div>
            </template>

            <DxPaging :enabled="false"/>
            <DxScrolling column-rendering-mode="virtual"/>

            <DxFilterRow :visible="showFilter" />
        </DxDataGrid>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { DxDataGrid, DxColumn, DxEditing, DxFilterRow, DxPaging, DxScrolling } from 'devextreme-vue/data-grid'
import { DxButton, DxSpeedDialAction } from 'devextreme-vue'

export default {
  props: {
    showFilter: {default: true}
  },
  components: {
    DxDataGrid,
    DxFilterRow,
    DxColumn,
    DxEditing,
    DxButton,
    DxPaging,
    DxScrolling,
    DxSpeedDialAction
  },
  computed: {
    ...mapState('gestione_lavori', ['list']),
    ...mapGetters('gestione_lavori', ['modeTitle', 'buttonAddTitle', 'noDeletedList'])
  },
  methods: {
    ...mapActions('gestione_lavori', ['safeDelete']),
    onDelete (cell) {
      if(!confirm('Confermi la cancellazione?')) return
      const {data} = cell.data
      this.safeDelete(data)
    },
    onRowDblClick (event) {
      this.openEditForm(event.data._id)
    },
    onCellClick (event) {
      if(event.columnIndex === 0) return
      if(!event.data || !event.data._id) return

      this.openEditForm(event.data._id)
    },
    onEdit (cell) {
      const {_id} = cell.data.data
      this.openEditForm(_id)
    },
    openEditForm (id) {
      this.$router.push(`/gestione_lavori/${id}`)
    },
    onAdd () {
      this.$router.push(`/gestione_lavori/add`)
    }
  }
}
</script>
