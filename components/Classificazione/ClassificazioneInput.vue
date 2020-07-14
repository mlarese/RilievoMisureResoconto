<template>
   <v-text-field
     :label="label"
     v-model="record[label]"
   />
</template>

<script>

export default {
  name: 'ClassificazioneInput',
  props: ['label', 'structure', 'record'],
  created() {
    if(!this.record) this.record = {}
    if(!this.record[this.label])  this.record[this.label] = this.structure
  }
}
</script>
