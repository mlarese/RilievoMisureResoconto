<template>
    <v-card class="pa-5 elevation-1">
        <div class="subtitle-2">
            Spazio utilizzato: {{usedSpace | number('0,0.00')}} Mb <br>
            Spazio disponibile: {{availableSpace | number('0,0.00')}} Mb

        </div>
        <div class="mt-5 align-center">
            <v-btn text small @click="onAddQuota">Add quota</v-btn>
        </div>
    </v-card>
</template>
<script>
  export default {
    created ( ){
      this.calcQuota()
    },
    data () {
      return {
        usedSpace: 0,
        availableSpace: 0
      }
    },
    methods: {
      onAddQuota () {
        this.newQuota()
      },
      newQuota () {
        let quota = 10 * 1024 * 1024 * 1024
        navigator.webkitPersistentStorage.requestQuota (
          quota,
          () => this.calcQuota()
        )
      },
      calcQuota () {
        // you could also use it from webkitPersistentStorage
        navigator.webkitPersistentStorage.queryUsageAndQuota(
          (usedSpace, availableSpace) => {
            this.usedSpace = usedSpace / (1024 * 1024 )
            this.availableSpace = availableSpace / (1024 * 1024)
          }
        )
      }
    }
  }
</script>
