<template>
  <DxBox direction="row" width="100%">
    <DxItem :ratio="2">
      <template #default>
        <DxButton @click="salva()" text="salva" />
        <!-- <ucProprieta :elencoProprieta="$record.props"></ucProprieta> -->
      </template>
    </DxItem>
    <DxItem :ratio="2">
      <template #default>
        <ucImmagine></ucImmagine>
      </template>
    </DxItem>
  </DxBox>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { DxButton, DxTextArea } from 'devextreme-vue'

import ucImmagine from '~/components/GestioneRilievo/ucImmagine'
import ucProprieta from '~/components/GestioneRilievo/ucProprieta'
import { DxBox, DxItem } from 'devextreme-vue/box'

const storeName = 'articoli'
export default {
  components: {
    ucProprieta,
    ucImmagine,
    DxBox,
    DxItem,
    DxButton
    // },
    // fetch ({store, params}) {
    //   store.dispatch('articoli/getById', 'demo',  {root: true})
    // },
    // computed: {
    //   ...mapState(storeName, ['$record']),
  },
  methods: {
    ...mapActions('rilievoDet', ['save']),
    ...mapMutations('rilievoDet', ['setRecord']),
    salva: function() {
      let record = {}
      record.RifPosID = '44a75306-ef40-45af-a1d5-cdacfd71e987'
      record.rilievoID = '72ef1dbd-b946-4873-bd43-50bb0a425155'
      record.Descrizione = 'terza posizione aaaa'

      let jsonDataString = window.GestoreImmagini.getDrawingCommands(
        'MACRO:DEMO1',
        200,
        200,
        -1,
        -1
      )
      let jsonData = JSON.parse(jsonDataString)

      record.drawingCMD = jsonData
      this.setRecord(record)
      this.save()
    }
  }
}
</script>
