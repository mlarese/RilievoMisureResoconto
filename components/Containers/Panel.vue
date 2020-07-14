<template>
  <div class="containerDiv">
    <v-app-bar extended extension-height="100" dark color="blue darken-2" class="elevation-0">
      <v-app-bar-nav-icon>
        <v-btn v-if="$vuetify.breakpoint.xsOnly" icon class="ml-1" @click="exit()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn v-if="$vuetify.breakpoint.smAndUp" fab small class="ml-1" @click="exit()" color="#2196F3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>

      <v-toolbar-title
        style="width:100%"
        class="px-0"
        :class="$vuetify.breakpoint.smAndUp ? 'd-flex justify-center ml-n2' : 'px-0'"
      >
        <slot name="toolbarTitle" />
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <slot name="panelToolbarRight"></slot>
    </v-app-bar>

    <!-- Contenuto principale -->
    <v-card
      class="mx-auto"
      :class="$vuetify.breakpoint.xsOnly ? 'mainCard_small' : 'mainCard_large'"
    >
      <slot name="mainContent" />
    </v-card>
  </div>
</template>

<style scoped>
.containerDiv {
  overflow: hidden;
  margin: 0px !important;
  padding: opx !important;
}
.mainCard_small {
  max-width: 700px;
  margin-top: -100px;
}
.mainCard_large {
  max-width: 700px;
  margin-top: -100px;
  margin-bottom: 5px;
}
</style>

<script>
export default {
  methods: {
    exit() {
      this.$router.back()
    }
  }
}
</script>
