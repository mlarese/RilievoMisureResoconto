<template>
  <v-row>
      <v-col :cols="9" class="py-0 pr-1">
        {{appunto.data.EV_Descrizione}}
      </v-col>

      <v-col :cols="2" class="pa-0">
        <div class="text-align-right">
          <v-btn @click="onEditAppunto" text small fab><v-icon small>edit</v-icon></v-btn>
        </div>
      </v-col>
  </v-row>

</template>
<script>
import { appuntimm } from './browsermx'
export default {
  mixins: [appuntimm],
  props: ['appunto'],
  methods: {
    onEditAppunto () {
      this.editAppunto(this.appunto)
    }
  }
}
</script>
