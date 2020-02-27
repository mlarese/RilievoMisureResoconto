<template>
  <v-layout class="grid-container" rows wrap>
    <slot></slot>
    <v-toolbar style="background: #f5f5f5"  dense class="elevation-1 pl-0" >
      <slot name="header-left">
        <v-toolbar-title class="subtitle-1">{{ title }}</v-toolbar-title>
      </slot>
      <v-spacer/>
      <slot name="header-right"></slot>
    </v-toolbar>


    <slot name="container-top"></slot>
      <slot name="body-top"></slot>
      <slot name="body-center"></slot>
      <slot name="body-bottom"></slot>


      <v-layout>
          <slot name="left-buttons"></slot>
          <v-spacer></v-spacer>
          <slot name="right-buttons"></slot>
      </v-layout>


  </v-layout>

</template>

<script>
  export default {
    components: {},
    props: {
      title: {default: 'title', type: String}
    }
  }
</script>
