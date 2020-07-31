<template>
  <v-row style="height: 100%">
    <v-btn
      v-if="$vuetify.breakpoint.smAndUp & canDecrement()"
      style="top: 50%"
      color="gray"
      absolute
      top
      left
      fab
      small
      @click="decrementImageIndex"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-btn
      v-if="$vuetify.breakpoint.smAndUp & canIncrement()"
      style="top: 50%"
      color="gray"
      absolute
      top
      right
      fab
      small
      @click="incrementImageIndex"
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>

    <!-- ANTEPRIMA ESTESA-->
    <v-col
      cols="12"
      style="height: calc(100% - 60px)"
      class="pa-0"
      v-touch="{
        left: () => incrementImageIndex(),
        right: () => decrementImageIndex()}"
    >
      <ResourceBig
        :key="indexRisorsa"
        :risorsa="risorsaSelezionata"
        v-on:onRemoveCurrentFile="removeFile()"
        :editable="editable"
      />
    </v-col>

    <!-- LISTA MINIATURE -->
    <v-col cols="12" style="height: 60px" class="py-0">
      <div
        class="d-flex py-2"
        style="width: calc(100%); overflow-x: auto"
        :class="$vuetify.breakpoint.smAndUp ? 'justify-center': 'justify-left'"
      >
        <div
          v-for="(ris, i) in listaRisorse"
          :key="i"
          @click="setImageIndex(i)"
          class="mr-1"
          :class="i == indexRisorsa ? 'elevation-10' : '' "
        >
          <ResourceAvatar :risorsa="ris" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style >
.avatarSelected {
  border-style: solid;
  border-width: 0 0 5px 0;
  border-color: green;
}
</style>

<script>
import { mapState } from 'vuex'
import ResourceAvatar from './ResourceAvatar'
import ResourceBig from './ResourceBig'

export default {
  name: 'ResourceGallery',
  components: {
    ResourceAvatar,
    ResourceBig
  },
  props: {
    listaRisorse: { type: Array, default: [] },
    editable: { type: Boolean, default: false }
  },
  data() {
    return {
      risorsaSelezionata: null,
      indexRisorsa: 0
    }
  },
  methods: {
    canIncrement() {
      return this.indexRisorsa < this.listaRisorse.length - 1
    },
    canDecrement() {
      return this.indexRisorsa > 0
    },
    setRisorsaSelezionata(ris) {
      this.risorsaSelezionata = ris
    },
    setImageIndex(index) {
      if (index < 0) {
        this.risorsaSelezionata = null
      } else {
        this.risorsaSelezionata = this.listaRisorse[index]
      }
      this.indexRisorsa = index
    },
    incrementImageIndex() {
      if (this.canIncrement()) {
        this.setImageIndex(this.indexRisorsa + 1)
      }
    },
    decrementImageIndex() {
      if (this.canDecrement()) {
        this.setImageIndex(this.indexRisorsa - 1)
      }
    },
    removeFile() {
      this.listaRisorse.splice(this.indexRisorsa, 1)
      this.setImageIndex(this.listaRisorse.length - 1)
    }
  }
}
</script>