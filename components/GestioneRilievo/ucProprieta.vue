<template>
  <div class="form">
    <div
      v-for="prop in elencoProprieta"
      v-bind:key="prop.codice"
      class="dx-fieldset"
    >
      <ucPropNumber v-if="prop.type == 'DEC'" :property="prop"></ucPropNumber>

      {{prop.label}}
    </div>
  </div>
</template>

<script>
import ucPropNumber from '../../components/property/ucPropNumber'

export default {
  components: {
    // ucPropNumber
  },
  props: {elencoProprieta: {default: []} }
}
</script>
