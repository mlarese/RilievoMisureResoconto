<template>
 <div>
    <div>
      <DxButton @click="salva()" text="salva" />
    </div>

    <div>
      <ucImmagine></ucImmagine>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

import ucImmagine from '~/components/GestioneRilievo/ucImmagine'
import ucProprieta from '~/components/GestioneRilievo/ucProprieta'
import { DxBox, DxItem } from 'devextreme-vue/box'

export default {
  components: {
    ucProprieta,
    ucImmagine,
    DxBox,
    DxItem
  },
  fetch ({store, params}) {
    store.dispatch('rilievoDet/getById', params.id,  {root: true})
  // },
  // computed: {
  //   ...mapState('rilievoDet', ['$record']),
  },
  methods: {
    ...mapActions('rilievoDet', ['save']),
    ...mapMutations('rilievoDet', ['setRecord']),
    salva: function() {
      this.save()
    }
  }
}
</script>
