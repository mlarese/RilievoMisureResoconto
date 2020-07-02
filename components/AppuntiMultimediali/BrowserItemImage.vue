<template>
  <div class="text-align-center overflow-x-hidden">

      <div class="text-align-center">
        <img ref="imageItem" :height="180" :src="image" />
      </div>
      <div class="caption align-left mt-2">{{appunto.description}}</div>
    </div>

  </div>
</template>bkstash
<script>
import {appuntimm} from './browsermx'
let curDate = null

export default {
  mixins: [appuntimm],
  props: ['appunto'],
  created () {
    for(let img in this.appunto._attachments) {
      this.onLoadAttachments(img)
      break
    }
  },
  methods: {
    async onLoadAttachments (itemName) {

      this.getAttachment({record: this.appunto, itemName})
      .then(ret => {
        try {

          let imgURL = URL.createObjectURL(ret)
          let img = this.$refs.imageItem
          img = img[0]
          this.image = imgURL

        } catch (e) {
        }


        // let imgB64 = `data:${type};base64,`+ btoa(arrayBuffer.toString())

        // img.src = imgB64
      })
      return ''
    }
  },
  data () {
    return {image: ''}
  }
}
</script>
