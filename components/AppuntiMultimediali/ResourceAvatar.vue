<template>
  <v-avatar tile :size="size">
    <v-img :src="(risorsa) ? risorsa.thumbnailUrl : '/images/img-placeholder.png'">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </v-avatar>
</template>

<script>
export default {
  props: {
    risorsa: { default: null },
    size: { default: 60 }
  }
}
</script>