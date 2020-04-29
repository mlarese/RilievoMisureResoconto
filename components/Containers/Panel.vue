<!--eslint-disable-->
<template>
  <div class="contetDiv blue darken-2 ma-0">
    <v-app-bar dense dark color="blue darken-2" class="elevation-0">
      <v-app-bar-nav-icon>
        <v-btn icon class="ml-1" @click="exit()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>

      <v-toolbar-title @click="compress()" style="width:100%">
        <div class="subtitle-1">
          <b>{{ title }}</b>
        </div>
        <div class="caption">{{ subtitle }}</div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon class="mr-1" @click="toggleExpand()">
        <v-icon>mdi-chevron-{{ expanded ? 'down' : 'up' }}</v-icon>
      </v-btn> -->
      <slot name="panelToolbarRight"></slot>
    </v-app-bar>
    <div class="masterPanel pb-10">
      <v-container class="px-2">
        <v-card flat style="border-radius: 16px">
          <v-card-text class="px-2 py-0">
            <slot name="back"></slot>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <v-card
      tile
      color="blue darken-2"
      :class="{ positiondown: !expanded, positionup: expanded }"
      class="elevation-12 slide ma-0"
      @click="expand()"
      v-touch:moving="movingHandler"
      v-touch:start="startHandler"
      v-touch:end="endHandler"
      ref="sliderCard"
      :ripple="false"
    >
      <slot name="slider"></slot>
    </v-card>
  </div>
</template>

<style scoped>
.contetDiv {
  height: 100vh !important;
  max-height: 100vh !important;
  overscroll-behavior-y: contain; /* disable pull to refresh, keeps glow effects */
}
.masterPanel {
  width: 100%;
  /* height: 100%; */
  max-height: calc(100vh - 48px);
  overflow: auto;
  z-index: 0;
}
.slide {
  border-radius: 16px 16px 0 0;
  height: calc(100vh - 45px);
  max-height: calc(100vh - 45px);
  position: fixed;
  width: 100%;
  transition: top 0s;
  overflow: auto;
  overscroll-behavior: contain;
}
.positionup {
  top: 48px;
}
.positiondown {
  top: calc(100vh - 40px);
}
</style>

<script>
export default {
  name: 'CardPanel',
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
  },
  data() {
    return {
      expanded: false,
      direction: '',
      firstTOP: null,
      startY: null
    }
  },
  methods: {
    exit() {
      this.$router.back()
    },
    toggleExpand() {
      this.expanded = !this.expanded
    },
    expand() {
      this.expanded = true
      let slider = this.$refs.sliderCard
      slider.$el.style.top = 48 + 'px'
      this.firstTOP = 48
    },
    compress() {
      this.expanded = false
      this.expanded = true
      let slider = this.$refs.sliderCard
      var h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
      slider.$el.style.top = h - 40 + 'px'
      this.firstTOP = h - 40
    },
    movingHandler(e) {
      if (this.startY == null) {
        return
      }
      let x = e.path.filter(function(item) {
        return item.className == 'masterDIV'
      })

      if (x.length > 0) {
        if (x[0].scrollTop > 0) {
          return
        }
      }
      let slider = this.$refs.sliderCard
      slider.$el.style.transition = '0s'

      if (e.touches == null) {
        return
      }

      let posY = e.touches[0].clientY
      let diff = this.startY - posY

      if (diff == 0) {
        return
      }

      if (diff > 0) {
        this.direction = 'up'
      } else {
        this.direction = 'down'
      }

      slider.$el.style.top = this.firstTOP - diff + 'px'
    },
    startHandler(e) {
      if (e.touches == null) {
        return
      }

      let offset = 0
      let x = e.path.filter(function(item) {
        return item.className == 'masterDIV'
      })

      if (x.length > 0) {
        if (x[0].scrollTop > 0) {
          offset = x[0].scrollTop
        }
      }

      let posY = e.touches[0].clientY
      this.startY = posY + offset
    },
    endHandler(e) {
      let slider = this.$refs.sliderCard
      slider.$el.style.transition = '0.5s'

      if (this.direction == 'up') {
        this.expand()
      } else {
        this.compress()
      }
      this.startY = null
    },
    vh(v) {
      var h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
      return (v * h) / 100
    }
  },
  mounted() {
    this.compress()
    // let slider = this.$refs.sliderCard
    // console.log(slider)
    //slider.addEventListener('touchstart', this.handleTouchStart, false)
    //   var el = document.getElementById("canvas");
    // el.addEventListener("touchstart", handleStart, false);
    //   document.addEventListener('touchstart', this.handleTouchStart, false)
    //   document.addEventListener('touchend', this.handleTouchEnd, false)
    // let self = this
    // let timer = setInterval(function() {
    //   self.expanded = false
    //   clearTimeout(timer)
    // }, 500)
  }
}
</script>
