<template>

  <v-card class="elevation-0" height="50px" >

    <div class="d-flex ">
      <v-text-field
        @keydown="onKeydown"
        ref="inputRef"
        autofocus
        placeholder="Scrivi un appunto"
        dense
        hide-details
        v-model="ui.message"
        :append-outer-icon="icon"
        prepend-icon="message"
        @click:append-outer="sendOrEdit"
        outlined  />
    </div>
  </v-card>

</template>

<script>
import {appuntimm} from './browsermx'

export default {
  mixins: [appuntimm],
  methods: {
    onKeydown (event) {
      if(event.key === 'Enter') {
        this.sendOrEdit()
      }

    },
    sendOrEdit () {
      if(this.isEmpty) {
        // this.$nextTick(() => {  this.$refs.inputRef.$refs.input.focus();  });
        this.setViewerStatusLoadImage()
      } else {
        this.addComment()
        .then(() => this.$vuetify.goTo(99999999999))
      }


    }
  },
  computed: {
    isEmpty () {
      if(!this.ui.message || this.ui.message === '') return true
      return false
    },
    icon () {
      return (this.isEmpty) ? 'camera_enhance' : 'send'
    }
  }
}
</script>
