<template>
  <DxBox direction="row" width="100%">
    <DxItem :ratio="2">
      <template #default>
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
import {mapState, mapGetters, mapActions} from 'vuex'

import ucImmagine from '~/components/GestioneRilievo/ucImmagine'
import ucProprieta from '~/components/GestioneRilievo/ucProprieta'
import { DxBox, DxItem } from 'devextreme-vue/box'

const storeName = 'articoli'
export default {
  components: {
    ucProprieta,
    ucImmagine,
    DxBox,
    DxItem
  // },
  // fetch ({store, params}) {
  //   store.dispatch('articoli/getById', 'demo',  {root: true})
  // },
  // computed: {
  //   ...mapState(storeName, ['$record']),
  }
}
</script>
