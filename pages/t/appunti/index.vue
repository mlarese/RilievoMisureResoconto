<template>
    <Browser class="overflow-hidden" :job="{job_description: 'AUSTECH', job_id: 'daac2b9e-dfa7-4311-b074-05f945e2ac95'}" />
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
