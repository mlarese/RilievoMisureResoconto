<template>
  <v-card class="px-5 py-5">
    <DxDataGrid
      id="xdgvElencoLavori"
      :data-source="noDeletedList"
      :show-borders="true"
      :show-column-lines="true"
      :show-row-lines="true"
      :row-alternation-enabled="true"
      keyExpr="_id"
      :columnAutoWidth="true"
      :column-hiding-enabled="true"
      noDataText="Nessun lavoro trovato"
      template="GridFormItem"
      @row-click="onCellClick"
      :@adaptive-detail-row-preparing="onAdaptiveDetailRowPreparing"
    >
      >
      <DxEditing :allow-updating="false" :allow-adding="true" mode="popup">
        <DxPopup :show-title="true" title="Creazione nuovo lavoro">
          <DxPosition my="top" at="top" of="window" />
        </DxPopup>
        <DxForm>
          <DxItem item-type="group">
            <DxItem data-field="committenteDesc" />
            <DxItem
              :editor-options="{ height: 100 }"
              data-field="descrizione"
              editor-type="dxTextArea"
            />
            <DxItem data-field="luogo" editor-type="dxTextArea" />
          </DxItem>
        </DxForm>
      </DxEditing>

      <DxSearchPanel :visible="true" :width="240" placeholder="Search..." />

      <DxColumn data-field="committenteDesc" caption="Committente" />
      <DxColumn data-field="descrizione" caption="Descrizione" />
      <DxColumn data-field="luogo" caption="Indirizzo" />

      <!-- <DxColumn :width="80"  :allow-sorting="false"  cell-template="commandsTemplate"/> -->
      <!-- <template #commandsTemplate="cell">
                <div>
                    <DxButton @click="onEdit(cell)" icon="edit" hint="Modifica lavoro" />
                    <DxButton @click="onDelete(cell)" icon="trash" hint="Cancella lavoro" />
                </div>
      </template>-->

      <DxPaging :enabled="false" />
      <DxScrolling column-rendering-mode="virtual" />
      <!-- <DxFilterRow :visible="showFilter" /> -->
    </DxDataGrid>
    <v-btn small class="mt-5" @click="onAdd">Aggiungi Nuovo Lavoro</v-btn>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxFilterRow,
  DxPaging,
  DxScrolling,
  DxSearchPanel,
  DxForm,
  DxPopup
} from 'devextreme-vue/data-grid'
import { DxButton, DxSpeedDialAction } from 'devextreme-vue'
import { DxItem } from 'devextreme-vue/form'
import DxTextArea from 'devextreme-vue/text-area'

export default {
  props: {
    showFilter: { default: true }
  },
  components: {
    DxDataGrid,
    DxFilterRow,
    DxColumn,
    DxEditing,
    DxButton,
    DxPaging,
    DxScrolling,
    DxSearchPanel,
    DxSpeedDialAction,
    DxForm,
    DxItem,
    DxTextArea,
    DxPopup
  },
  computed: {
    ...mapState('gestione_lavori', ['list']),
    ...mapGetters('gestione_lavori', [
      'modeTitle',
      'buttonAddTitle',
      'noDeletedList'
    ])
  },
  methods: {
    ...mapActions('gestione_lavori', ['safeDelete']),
    onDelete(cell) {
      if (!confirm('Confermi la cancellazione?')) return
      const { data } = cell.data
      this.safeDelete(data)
    },
    onRowDblClick(event) {
      this.openEditForm(event.data._id)
    },
    onCellClick(event) {
      if (event.columnIndex === 0) return
      if (!event.data || !event.data._id) return

      this.openEditForm(event.data._id)
    },
    onEdit(cell) {
      const { _id } = cell.data.data
      this.openEditForm(_id)
    },
    openEditForm(id) {
      this.$router.push(`/gestione_lavori/${id}`)
    },
    onAdd() {
      this.$router.push(`/gestione_lavori/add`)
    },
    onAdaptiveDetailRowPreparing(e) {
      for (let formItem of e.formOptions.items) {
      }
    }
  }
}
</script>
