<template>

    <v-container fluid>
      <v-row>
        <v-col v-for="(img, n) in appunto.files" :key="n"  class="d-flex child-flex pa-1"  cols="4" >
          <v-card flat tile class="d-flex">
            <v-img
              :src="img.url"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="caption align-left">{{appunto.note}}</div>
        </v-col>

      </v-row>
    </v-container>
</template>
<script>
let curDate = null

export default {
  props: ['appunto']
}
</script>
