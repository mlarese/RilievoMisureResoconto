<template>
  <v-card class="elevation-0 overflow-x-hidden px-1" :height="getHeight + 'px'" id="scroll-target">
    <v-row align="stretch" id="scrolled-content">
      <template v-for="appunto in appuntiFiltered">
        <v-col class="py-0" :cols="12" v-if="show(appunto.insert_UTCDate)" :key="appunto._id + appunto.insert_UTCDate">
          <BrowserItemDate :appunto="appunto" />
        </v-col>

        <v-col :cols="12" :xs="12" :sm="6" :md="4" :id="'ap_' + appunto._id" :key="appunto._id">
          <a :name="'ap_' + appunto._id" :href="'ap_' + appunto._id" />
          <BrowserItemFactory :appunto="appunto" />
        </v-col>
      </template>
    </v-row>
    <a id="end-appunti-browser-view" />

    <GalleryBox />
    
  </v-card>
</template>

<script>
import BrowserItemDate from '~/components/AppuntiMultimediali/BrowserItemDate'
import BrowserItemFactory from '~/components/AppuntiMultimediali/BrowserItemFactory'
import GalleryBox from '../Risorse/GalleryBox'
import { appuntimm } from './browsermx'

export default {
  mixins: [appuntimm],
  components: { BrowserItemDate, BrowserItemFactory, GalleryBox },
  date() {
    return {
      lastDate: null
    }
  },
  methods: {
    show(date) {
      try {
        if (!this.lastDate) {
          this.lastDate = date
          return true
        }

        if (this.sameDay(date, this.lastDate)) {
          return false
        } else {
          this.lastDate = date
          return true
        }
        // if (date) {
        //   date = date.substring(0, 10)
        //   if (date === this.lastDate) {
        //     return false
        //   }
        //   this.lastDate = date
        //   return true
        // } else {
        //   return false
        // }
      } catch (error) {
        console.log(error)
      }
    },
    sameDay(d1, d2) {
      d1 = new Date(d1)
      d2 = new Date(d2)
      return d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
    },
    scrollDown() {
      // var elem = document.getElementById('scrolled-content')
      var container = document.getElementById('scroll-target')
      if (!container) return
      container.scrollTop = container.scrollHeight
    }
  },
  computed: {
    getHeight() {
      let offset = -10
      if (this.$el) offset = this.$el.offsetTop
      if (this.$vuetify.breakpoint.xsOnly) {
        return this.$vuetify.breakpoint.height - 220 //+ offset
      } else {
        return this.$vuetify.breakpoint.height - 400 //+ offset
      }
    }
  },
  mounted() {
    setTimeout(this.scrollDown, 500)
  }
}
</script>
