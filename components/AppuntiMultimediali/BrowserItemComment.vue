<template>
  <span>
    {{appunto.appunto.data.EV_Note}}
  </span>

</template>
<script>
let curDate = null

export default {
  props: ['appunto']
}
</script>
