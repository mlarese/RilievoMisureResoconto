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
      this.save()
    }
  }
}
</script>
