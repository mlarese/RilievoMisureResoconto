<template>

  <v-card class="elevation-0 overflow-x-hidden"  >
    <v-row align="stretch" >
      <template v-for="appunto in appuntiFiltered">

          <v-col :cols="12" v-if="show(appunto.date)">
              <BrowserItemDate :appunto="appunto" />
          </v-col>

          <v-col :cols="12" :xs="12" :sm="6"  :md="4" :id="'ap_' + appunto._id">
            <a :name="'ap_' + appunto._id" :href="'ap_' + appunto._id" />
            <BrowserItemFactory  :appunto="appunto" />
          </v-col>

      </template>
    </v-row>
    <a id="end-appunti-browser-view"/>
  </v-card>

</template>

<script>
import BrowserItemDate from "~/components/AppuntiMultimediali/BrowserItemDate";
import BrowserItemFactory from "~/components/AppuntiMultimediali/BrowserItemFactory";
import {appuntimm} from './browsermx'

export default {
  mixins: [appuntimm],
  components: {BrowserItemDate, BrowserItemFactory},
  date () {
    return {
      lastDate: '1900-01-01'
    }
  },
  methods: {
    show (date) {
      date = date.substring(0, 10)
      if( date === this.lastDate) {
        return false
      }
      this.lastDate = date
      return true
    }
  }
}
</script>
