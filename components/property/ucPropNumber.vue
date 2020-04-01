<template>
  <div class="dx-field">
    <div class="dx-field-label">Default mode</div>
    <div class="dx-field-value">
      <DxNumberBox :value="property.valore" />
    </div>
  </div>
</template>

<script>
import { DxNumberBox } from 'devextreme-vue/number-box'

export default {
  components: {
    DxNumberBox
  },
  props: { property: {default: {}} }
}
</script>
