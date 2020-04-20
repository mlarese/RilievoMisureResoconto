<!--eslint-disable-->
<template>
  <div>
    <v-toolbar class="d-block elevation-5" dense color="blue accent-3" dark>
      <v-btn icon class="ml-1" @click="exit()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>
        <div class="subtitle-1">
          <b>{{title}}</b>
        </div>
        <div class="caption">{{subtitle}}</div>
      </v-toolbar-title>
    </v-toolbar>

    <v-card class="d-block" tile style="min-height:100px">
      <v-container grid-list-md fluid>
        <slot></slot>
      </v-container>
    </v-card>
  </div>
</template>


<script>
export default {
  name: 'CardPanel',
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
  },
  methods: {
    exit() {
      this.$router.back()
    }
  }
}
</script>
