<template>
  <PhotoEditor :visible="true"  image-url="blob:http://localhost:3000/f4039b9b-bb8b-4a41-8070-6784f543e756"/>
</template>
<script>
import PhotoEditor from '../components/Photo/PhotoEditor'
export default {
  head () {
    return {
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' },
        { hid: 'image-editor-viewport',name:"viewport", content:"width=device-width, initial-scale=1, shrink-to-fit=no"}
      ]
    }
  },
  components: {PhotoEditor}
}
</script>
