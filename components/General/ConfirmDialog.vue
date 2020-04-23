<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{title}}</v-card-title>
        <v-card-text>{{text}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Si</v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">NO</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

  export default {
    props: {
        dialog: {default: false },
        title: {type: String, default: ''},
        text: {type: String, default: ''}
    },
    data() {
      return {
        isYes: false
      };
    },
    methods: {
        close() {
        this.$emit('update:dialog', false)
      },

      yesClick(){
        this.$emit('update:isYes', true);
        this.$emit('update:dialog', false)
      },
      noClick(){
        this.$emit('update:isYes', false);
        this.$emit('update:dialog', false)
      }
    }
  }

</script>