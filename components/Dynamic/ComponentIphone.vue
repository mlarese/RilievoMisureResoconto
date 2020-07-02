<template>
  <div>
    {{titolo}} component iphone
  </div>
</template>
<script>
export default {
  components: {},
  props: ['titolo'],
  created () {
    console.log('------- iphone')
  }
}
</script>
