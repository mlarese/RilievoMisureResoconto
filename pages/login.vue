<template>
    <Login/>
</template>
<script>
  import Login from '../components/Login/Login'
  export default {
    layout: 'login',
    components: {Login},
    async fetch ({store}) {
      // const res = await store.dispatch('auth/persistentUser', {}, {root: true})
    }
  }
</script>
