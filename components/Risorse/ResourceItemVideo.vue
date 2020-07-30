<template>
  <div style="height: 100%" class="d-flex align-center justify-center">
    <video style="width: 100%; max-height: calc(100%)" controls>
      <source :src="src" :type="typeFile" />Your browser does not support HTML video.
    </video>
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