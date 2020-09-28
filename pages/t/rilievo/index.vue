<template>
  <cmp />
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Provide } from 'nuxt-property-decorator'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import cmp from '../../../components/gestione_rilievo/main.vue'

@Component({
  components: { cmp },
  name: 'test',
  template: 'fullPage.vue'
})
export default class RilievoComp extends Vue {
  public layout: string = `fullPage`
}
</script>