<template>

    <v-combobox

      :label="label"
      :items="structure"
      v-model="record[label]"
    />


</template>
<script>
export default {
  name: 'ClassificazioneCombo',
  components: {},
  props: ['label', 'structure', 'record']
}
</script>
