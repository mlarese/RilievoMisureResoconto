<template>

    <div>
        <DxDataGrid
          id="xdgvElencoLavori"
          :data-source="noDeletedList"
          :show-borders="true"
          keyExpr="uid"
          :columnAutoWidth="true"
          noDataText="Nessun lavoro trovato"
        >

          <DxFilterRow :visible="true"/>
            <DxColumn :width="80"  :allow-sorting="false"  cell-template="commandsTemplate"/>

            <DxColumn data-field="committenteDesc" caption="Committente" />
            <DxColumn  data-field="descrizione"  caption="Descrizione"  />
            <DxColumn data-field="luogo"   caption="Indirizzo"   />


            <template #commandsTemplate="cell">
                <div>
                    <DxButton
                            @click="onEdit(cell)"
                            icon="edit"
                            hint="Modifica lavoro"
                    />
                    <DxButton
                            @click="onDelete(cell)"
                            icon="trash"
                            hint="Cancella lavoro"
                    />
                </div>

            </template>

            <DxSpeedDialAction
                    :on-click="onAdd"
                    :index="1"
                    icon="add"
                    :label="buttonAddTitle"
            />
        </DxDataGrid>
    </div>
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
    ...mapGetters('gestione_lavori', ['modeTitle', 'buttonAddTitle', 'noDeletedList'])
  },
  methods: {
    ...mapActions('gestione_lavori', ['safeDelete']),
    onDelete (cell) {
      if(!confirm('Confermi la cancellazione?')) return
      const {data} = cell.data
      this.safeDelete(data)
    },
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
