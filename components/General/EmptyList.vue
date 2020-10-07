<template>
<v-container class="fill-height">
    <v-row align="center" >
      <v-col cols="12" sm="8">
        <v-img
          :src="require('../../assets/images/search.svg')"
          aspect-ratio="5"
          contain
          class="mb-5"
        ></v-img>

        <p class="title text-center">{{ title }}</p>
        <p class="caption font-weight-light text-center" style="margin-top: -20px;">{{ subtitle }}</p>
      </v-col>
    </v-row>
</v-container>
</template>

<script>
export default {
  name: 'EmptyList',
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
  }
}
</script>