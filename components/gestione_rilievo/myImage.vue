<template>
  <img :src="imgURL" />
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato, JSArticolo, PropertyValued, JSTableRow } from '@/store/articoloModel'

@Component({ components: {}, name: 'myIMG' })
export default class myIMG extends Vue {
  @Prop({ type: Object, default: {} }) artGen!: ArticoloGeneraleConfigurato

  imgURL = ''

  loadImmagine() {
    let id = `${this.artGen.azienda}.${this.artGen.catalogo}.${this.artGen.codice}`
    this.$store.dispatch('articoli/getById', id).then(art => {
      this.$store.dispatch('dm_resources/getRisorsaById', art.JSImmagineRisID).then(res => {
        this.imgURL = res.thumbnailUrl
      })
    })
  }

  mounted() {
    this.loadImmagine()
  }
}
</script>