<template>
    <Browser class="overflow-hidden" :job="{job_description: 'AUSTECH', job_id: '46e20be9-39e5-4675-bfb0-9d8d62c79dd7'}" />
</template>

<script>
import Browser from "~/components/AppuntiMultimediali/Browser"

export default {
  components: { Browser },
  async fetch ({store}) {
    await store.dispatch('appuntimm/load',null, {root: true})
  }
}
</script>
