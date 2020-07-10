<template>
  <div>
    <component   :is="currentComponent" :label="label" :structure="structure" :record="record" />
  </div>

</template>

<script>
import _isArray from 'lodash/isArray'
import _isString from 'lodash/isString'

export default {
  name: "ClassificazioneFactory",
  props: ['label', 'structure', 'record'],
  computed: {
    currentComponent () {
      if(this.structure && _isArray(this.structure)) {
        return 'ClassificazioneCombo'
      }

      return 'ClassificazioneInput'
    }
  }
}
</script>

