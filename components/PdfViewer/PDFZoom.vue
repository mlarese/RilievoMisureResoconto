<template>
  <v-toolbar-items>
    <!-- <a @click.prevent.stop="zoomIn" class="icon" :disabled="isDisabled"><ZoomInIcon /></a>
    <a @click.prevent.stop="zoomOut" class="icon" :disabled="isDisabled"><ZoomOutIcon /></a>
    <a @click.prevent.stop="fitWidth" class="icon" :disabled="isDisabled"><ExpandIcon /></a>
    <a @click.prevent.stop="fitAuto" class="icon" :disabled="isDisabled"><ShrinkIcon /></a> -->

    

      <v-btn icon @click.prevent.stop="zoomIn" :disabled="isDisabled">
        <v-icon color="white">mdi-magnify-plus</v-icon>
      </v-btn>

      <v-btn icon @click.prevent.stop="zoomOut" :disabled="isDisabled">
        <v-icon color="white">mdi-magnify-minus</v-icon>
      </v-btn>

      <v-btn icon @click.prevent.stop="fitWidth" :disabled="isDisabled">
        <v-icon color="white">mdi-arrow-expand</v-icon>
      </v-btn>

      <v-btn icon @click.prevent.stop="fitAuto" :disabled="isDisabled">
        <v-icon color="white">mdi-arrow-collapse</v-icon>
      </v-btn>




      
  </v-toolbar-items>
</template>

<script>
// import ZoomInIcon from '../../assets/images/icon-zoom-in.svg';
// import ZoomOutIcon from '../../assets/images/icon-zoom-out.svg';
// import ExpandIcon from '../../assets/images/icon-expand.svg';
// import ShrinkIcon from '../../assets/images/icon-shrink.svg';

export default {
  name: 'PDFZoom',

  // components: {
  //   ZoomInIcon,
  //   ZoomOutIcon,
  //   ExpandIcon,
  //   ShrinkIcon,
  // },

  props: {
    scale: {
      type: Number,
    },
    increment: {
      type: Number,
      default: 0.25,
    },
  },

  computed: {
    isDisabled() {
      return !this.scale;
    },
  },

  methods: {
    zoomIn() {
      this.updateScale(this.scale + this.increment);
    },

    zoomOut() {
      if (this.scale <= this.increment) return;
      this.updateScale(this.scale - this.increment);
    },

    updateScale(scale) {
      this.$emit('change', {scale});
    },

    fitWidth() {
      this.$emit('fit', 'width');
    },

    fitAuto() {
      this.$emit('fit', 'auto');
    },
  },
}
</script>

