<template>
  <div>
    <div>
      <DxDataGrid
        id="gridRilievo"
        :data-source="listaPosizioni"
        :show-borders="true"
        :repaint-changes-only="true"
        :remoteOperations="false"
        ref="dataGridRefKey"
        @row-prepared="onCellPrepared"
        @row-inserted="insertRow"
        @row-updated="updateRow"
        @row-removed="removeRow"
      >
        <DxEditing
          :allow-updating="true"
          :allow-deleting="true"
          :allow-adding="true"
          mode="popup"
        >
          <DxPopup
            :show-title="false"
            :width="500"
            :height="300"
          >
            <DxPosition my="top" at="top" of="window" />
          </DxPopup>
          <DxForm>
            <DxItem :col-count="2" :col-span="2" item-type="group">
              <DxItem :col-span="2" caption="Posizione" data-field="posizioneDesc" />
              <DxItem :col-span="2" caption="Quantità" data-field="PosQta" editor-type="dxNumberBox" />
            </DxItem>
          </DxForm>
        </DxEditing>

        <!-- <DxColumn
          :width="80"
          :allow-sorting="false"
          cell-template="commandsTemplate"
        /> -->
        <DxColumn caption="Posizione" data-field="posizioneDesc" width="300" />
        <DxColumn caption="Quantità" data-field="PosQta" />
        <DxColumn caption="Quantità" data-field="_id" />

        <template #commandsTemplate="cell">
          <div>
            <DxButton
              @click="onPosEdit(cell)"
              icon="edit"
              hint="Modifica posizione"
            />
            <DxButton
              @click="onPosDelete(cell)"
              icon="trash"
              hint="Elimina posizione"
            />
          </div>
        </template>

        <DxSearchPanel :visible="true" />

        <DxMasterDetail
          :enabled="true"
          template="masterDetailTemplate"
          :autoExpandAll="true"
        />
        <template #masterDetailTemplate="rowDettaglio">
          <ucGridDettaglio :templateData="rowDettaglio.data" />
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import {
  DxMasterDetail,
  DetailTemplate,
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxFilterRow,
  DxSelection,
  DxHeaderFilter,
  DxSearchPanel,
  DxPopup,
  DxForm,
  DxPosition
} from 'devextreme-vue/data-grid'
import { DxItem } from 'devextreme-vue/form';
import { DxButton } from 'devextreme-vue'
import CustomStore from 'devextreme/data/custom_store'
import ucGridDettaglio from '~/components/GestioneRilievo/ucGridDettaglio'

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxFilterRow,
    DxSelection,
    DxHeaderFilter,
    DxSearchPanel,
    DxButton,
    DxMasterDetail,
    DetailTemplate,
    ucGridDettaglio,
    DxPopup,
    DxForm,
    DxItem,
    DxPosition
  },
  props: [],
  computed: {
    ...mapState('rilievoPos', ['listaPosizioni']),
    dataGrid: function() {
      return this.$refs['dataGridRefKey'].instance
    }
  },
  data() {
    return {
      posizioniDataSource: new CustomStore({
        key: '_id',
        load: () => this.getListaPos(),
        insert: (value) => this.insertRow(value),
        update: (key, value) => this.updateRow(key, value),
        remove: (key) => this.deleteRow(key)
      })
    }
  },
  methods: {
    ...mapActions('rilievoPos', ['load']),
    ...mapMutations('rilievoPos', ['setRecord']),
    ...mapActions('rilievoPos', {
      saveRow: 'save',
      deleteRow: 'deleteByID'
    }),
    insertRow({ data }) {
      delete data.__KEY__
      console.log(data)
      this.setRecord(data)
      this.saveRow()
    },
    updateRow({ data }) {
      console.log(data)
      this.setRecord(data)
      this.saveRow()
    },
    removeRow({ data }) {
      console.log(data._id)
      this.deleteRow(data._id)
    },
    getListaPos() {
      return Promise.resolve(this.listaPosizioni).then(function(value) {
        return { data: value }
      })
    },
    onAddPosClick() {
      this.dataGrid.refresh()
    },
    onCellPrepared(e) {
      // if (e.rowElement.rowIndex > 0){
      //   e.rowElement.style.backgroundColor = '#8bc34a'
      // }
    }
  }
}
</script>
