<template>
  <div style="height: calc(100%)">
    <PDFViewer
      v-if="ViewerHeight > 0"
      v-bind="{url: src, maxheight: ViewerHeight}"
      style="width: 100%"
    />
  </div>
</template>

<script>
import PDFViewer from '../PdfViewer/PDFViewer'

export default {
  props: { src: { type: String, default: null } },

  components: {
    PDFViewer
  },

  data() {
    return {
      ViewerHeight: 0
    }
  },

  mounted() {
    this.ViewerHeight = this.$el.clientHeight - 48
  }
}
</script>

<style scoped>
.error {
  border: 1px solid red;
  background: pink;
  color: red;
  padding: 0.5em 3em;
  display: inline;
}

a.icon {
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  padding: 0.25em;
  width: 1em;
  height: 1em;
  font-size: 1.5em;
}

.box-shadow {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
}
.overflow-hidden {
  overflow: hidden;
}
</style>