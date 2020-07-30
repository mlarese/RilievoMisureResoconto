<template>
  <div style="height: 100%" class="d-flex align-center justify-center">
    <audio controls>
      <source :src="src" :type="typeFile" />Your browser does not support the audio element.
    </audio>
  </div>
</template>


<script>
export default {
  props: {
    src: { type: String, default: null },
    typeFile: { type: String, default: null }
  }
}
</script>