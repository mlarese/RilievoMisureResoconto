<template>
  <div>    
    <dx-data-grid
      id="xdgvElencoLavori"
      :data-source="listaLavori"
      :show-borders="true"
    >
    <DxColumn
        data-field="GL_Committente"
        caption="Committente"
      />
    <DxColumn
        data-field="GL_Descrizione"
        caption="Descrizione"
      />
    <DxColumn
        data-field="GL_Indirizzo"
        caption="Indirizzo"
      />
    </dx-data-grid>
  </div>
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
    ...mapState('GestioneLavori/DM_Lavori', { 'listaLavori': 'list' })
  },
  methods: {
    ...mapActions('GestioneLavori/DM_Lavori', {
      loadRows: 'load',
    }),
  btnNuovoLavoro() {}
  },
  beforeMount(){
    this.loadRows()
  }
}
</script>