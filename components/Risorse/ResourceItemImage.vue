<template>
  <div style="height: 100%" class="d-flex align-center justify-center">
    <v-img :src="src" contain style="max-height: calc(100%)" />
  </div>
</template>

<script>
export default {
  props: { src: { type: String, default: null } }
}
</script>