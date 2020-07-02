<template>
  <div class="align-center">

      <div  v-for="(img, name) in appunto._attachments">
        {{name}}
        <v-img v-if="false" :src="appunto.files[0].url" :height="180" />
      </div>
      <div class="caption align-left mt-2">{{appunto.note}}</div>
    </div>

  </div>
</template>
<script>
let curDate = null

export default {
  props: ['appunto']
}
</script>
