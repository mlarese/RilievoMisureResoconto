<template>
  <v-card flat color="#606f7b">
    <v-toolbar dense color="#606f7b" >
      <v-spacer></v-spacer>

      <v-btn icon @click.prevent.stop="togglePreview">
        <v-icon color="white">mdi-format-list-bulleted-square</v-icon>
      </v-btn>

      <PDFZoom :scale="scale" @change="updateScale" @fit="updateFit" />

      <PDFPaginator v-model="currentPage" :pageCount="pageCount" />
      <v-spacer></v-spacer>

      <slot name="header"></slot>
    </v-toolbar>

    <PDFData
      :url="url"
      @page-count="updatePageCount"
      @page-focus="updateCurrentPage"
      @document-rendered="onDocumentRendered"
      @document-errored="onDocumentErrored"
      class="d-flex"
    >
      <template v-slot:preview="{pages}">
        <PDFPreview
          v-show="isPreviewEnabled"
          class="pdf-viewer__preview"
          v-bind="{pages, scale, currentPage, pageCount, isPreviewEnabled, maxheight}"
        />
      </template>

      <template v-slot:document="{pages}">
        <PDFDocument
          class="pdf-viewer__document"
          :class="{ 'preview-enabled': isPreviewEnabled }"
          v-bind="{pages, scale, optimalScale, fit, currentPage, pageCount, isPreviewEnabled, maxheight}"
          @scale-change="updateScale"
        />
      </template>
    </PDFData>
  </v-card>
</template>

<script>
import PDFDocument from './PDFDocument'
import PDFData from './PDFData'
import PDFPaginator from './PDFPaginator'
import PDFPreview from './PDFPreview'
import PDFZoom from './PDFZoom'

function floor(value, precision) {
  const multiplier = Math.pow(10, precision || 0)
  return Math.floor(value * multiplier) / multiplier
}

export default {
  name: 'PDFViewer',

  components: {
    PDFDocument,
    PDFData,
    PDFPaginator,
    PDFPreview,
    PDFZoom
  },

  props: {
    url: String,
    maxheight: { type: Number, default: 0 }
  },

  data() {
    return {
      scale: undefined,
      optimalScale: undefined,
      fit: undefined,
      currentPage: 1,
      pageCount: undefined,
      isPreviewEnabled: false
    }
  },

  methods: {
    onDocumentRendered() {
      this.$emit('document-errored', this.url)
    },

    onDocumentErrored(e) {
      this.$emit('document-errored', e)
    },

    updateScale({ scale, isOptimal = false }) {
      const roundedScale = floor(scale, 2)
      if (isOptimal) this.optimalScale = roundedScale
      this.scale = roundedScale
    },

    updateFit(fit) {
      this.fit = fit
    },

    updatePageCount(pageCount) {
      this.pageCount = pageCount
    },

    updateCurrentPage(pageNumber) {
      this.currentPage = pageNumber
    },

    togglePreview() {
      this.isPreviewEnabled = !this.isPreviewEnabled
    }
  },

  watch: {
    url() {
      this.currentPage = undefined
    }
  },

  mounted() {
    document.body.classList.add('overflow-hidden')
  }
}
</script>

<style scoped>

.pdf-viewer .pdf-viewer__document,
.pdf-viewer .pdf-viewer__preview {
  top: 70px;
  float: left;
}

.pdf-viewer__preview {
  display: block;
  width: 30%;
  right: 65%;
}

.pdf-viewer__document {
  top: 70px;
  width: 100%;
  left: 0;
}

.pdf-viewer__document.preview-enabled {
  width: 85%;
  left: 15%;
}

@media print {
  header {
    display: none;
  }
}
</style>
