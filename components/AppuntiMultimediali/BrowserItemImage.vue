<template>
  <div class="align-center">

      <div  v-for="(record, itemName) in appunto._attachments">
        <span v-show="false">{{ onLoadAttachments(itemName) }}</span>
        <img ref="imageItem" :height="180" :src="image" />
      </div>
      <div class="caption align-left mt-2">{{appunto.note}}</div>
    </div>

  </div>
</template>bkstash
<script>
import {appuntimm} from './browsermx'
let curDate = null

export default {
  mixins: [appuntimm],
  props: ['appunto'],
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
