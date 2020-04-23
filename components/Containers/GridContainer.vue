<template>
  <v-layout class="grid-container" rows wrap>
<!--     <slot></slot> -->
    <slot name="container-top"></slot>
    <slot name="body-top"></slot>
    <!-- <div style="overflow-x:scroll"> -->
      <slot name="body-center"></slot>
    <!-- </div> -->
    <slot name="body-bottom"></slot>

    <v-layout>
      <slot name="left-buttons"></slot>
      <v-spacer></v-spacer>
      <slot name="right-buttons"></slot>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  props: {
    title: { default: 'title', type: String }
  },
  methods: {
    onAdd() {
      this.$router.push(`/gestione_lavori/add`)
    }
  }
}
</script>
