<template>
  <div ref="showCanvas" style="max-width = 100%"></div>
</template>

<script>
import range from 'lodash/range'

export default {
  props: ['src'],
//   data() {
//     return {
//       src2: src
//     }
//   },
  mounted() {
    import('pdfjs-dist/webpack').then((pdfjs) => {
      pdfjs
        .getDocument(this.src)
        .promise.then((pdf) => {
          const pagePromises = range(1, pdf.numPages).map((number) =>
            pdf.getPage(number)
          )
          return Promise.all(pagePromises)
        })
        .then(
          (pages) => {
            const scale = 2

            const canvases = pages.forEach((page) => {
              const viewport = page.getViewport({ scale: 0.5 });

              // Prepare canvas using PDF page dimensions
              const canvas = document.createElement('canvas')
              canvas.height = viewport.height
              canvas.width = viewport.width

              // Render PDF page into canvas context
              const canvasContext = canvas.getContext('2d')
              const renderContext = { canvasContext, viewport }
              page
                .render(renderContext).promise
                .then(() => console.log('Page rendered'))

              this.$refs.showCanvas.appendChild(canvas)
            })
          },
          (error) => console.log('Error', error)
        )
    })
  }
}
</script>