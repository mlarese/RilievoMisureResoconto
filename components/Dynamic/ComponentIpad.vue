<template>
  <div>
      {{titolo}} component ipad
    <div>
      <input type="text" v-model="value" style="height: 30px; border 3px solid red; width:200px;">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value:'vuoto'
    }
  },
  components: {},
  props: ['titolo'],
  created () {
    console.log('------- ipad')
  }
}
</script>
