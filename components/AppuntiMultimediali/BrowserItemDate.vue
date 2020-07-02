<template>
  <div class="text-align-center">
    <v-chip class="ma-2" color="green lighten-4" >
      <div>{{appunto.date | dmy}}</div>
    </v-chip>
  </div>
</template>
<script>
let curDate = null

export default {
  components: {},
  props: ['appunto']
}
</script>
