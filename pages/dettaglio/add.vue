<template>
  <!-- <DxBox direction="row" width="100%">
    <DxItem :ratio="2">
      <template #default>
        <div>
          <DxTextArea
            :height="90"
            :read-only="false"
            :value.sync="$record.Descrizione"
          />
          <DxButton @click="salva()" text="salva" />
        </div>
        <ucProprieta :elencoProprieta="$record.props"></ucProprieta>
      </template>
    </DxItem>
    <DxItem :ratio="2">
      <template #default>
      </template>
    </DxItem>
  </DxBox> -->
        <ucImmagine></ucImmagine>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { DxButton, DxTextArea } from 'devextreme-vue'

import ucImmagine from '~/components/GestioneRilievo/ucImmagine'
import ucProprieta from '~/components/GestioneRilievo/ucProprieta'
import { DxBox, DxItem } from 'devextreme-vue/box'

export default {
  components: {
    ucProprieta,
    ucImmagine,
    DxBox,
    DxItem,
    DxButton,
    DxTextArea
    // },
    // fetch ({store, params}) {
    //   store.dispatch('articoli/getById', 'demo',  {root: true})
  },
  computed: {
    ...mapState('rilievoDet', ['$record'])
  },
  methods: {
    ...mapActions('rilievoDet', ['save']),
    ...mapMutations('rilievoDet', ['setRecord']),
    salva: function() {
      // let record = {}
      // record.RifPosID = '4f0db092-fedc-4e97-a607-323f143cd3ad'
      // record.rilievoID = '59818e70-71b0-4aa6-b4a7-a6d9ff2cddab'
      // record.Descrizione = 'sec posizione aaa'

      // let jsonDataString = window.GestoreImmagini.getDrawingCommands(
      //   'MACRO:DEMO1',
      //   200,
      //   200,
      //   -1,
      //   -1
      // )
      // let jsonData = JSON.parse(jsonDataString)

      // record.drawingCMD = jsonData
      // this.setRecord(record)
      this.save()
    }
  }
}
</script>
