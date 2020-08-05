<template>
  <v-container class="mainContainer">
    <!-- LISTA MODELLI -->
    <v-row dense>
      <v-col v-for="(item, i) in lista" :key="i" class="d-flex align-content-start flex-wrap">
        <v-card color="white" @click="rowClick(item)" min-width="300" max-height="200">
          <div class="d-flex flex-no-wrap">
            <ImmagineDet
                :drawingCommands="JSON.parse(item.JSModPIM)"
                :imgWidth="100"
                :imgHeight="100"
            ></ImmagineDet>
            <div class="flex-grow-1 flex-shrink-1">
              <v-card-title
                v-text="item.JSModDesc"
                class="headline"
                style="word-break: normal;"
              />
              <v-card-subtitle v-text="item.JSModCodice" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.mainContainer {
  height: 100%;
}
</style>

<script>
import ImmagineDet from '../GestioneRilievo/ImmagineDet'

export default {
  props: { lista: { type: Array, default: [] } },
  components: {
      ImmagineDet
  },
  methods: {
    rowClick(modello) {
      this.$emit('onSelected', modello)
    }
  },
  mounted(){

  }
}
</script>
