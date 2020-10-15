<template>
  <v-card>
    <p style="width: 100%; height:60px" class="pt-3 pr-10 text-h3 text-right font-weight-bold">{{ valore }}</p>
    <v-card-text>
      <v-card flat class="d-flex justify-center">
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('7')">7</v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('8')">8</v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('9')">9</v-btn>
      </v-card>
      <v-card flat class="d-flex justify-center">
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('4')">4</v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('5')">5</v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('6')">6</v-btn>
      </v-card>
      <v-card flat class="d-flex justify-center">
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('1')">1</v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('2')">2</v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('3')">3</v-btn>
      </v-card>
      <v-card flat class="d-flex justify-center">
        <v-btn fab large elevation="1" class="ma-2" @click="deleteOnce"><v-icon>mdi-backspace-outline</v-icon></v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="setValue('0')">0</v-btn>
        <v-btn fab large elevation="1" class="ma-2" @click="deleteAll">C</v-btn>
      </v-card>
    </v-card-text>
    <v-card-actions class="d-flex justify-center">
      <v-btn x-large width="50%" text color="gray" @click="annulla">Annulla</v-btn>
      <v-btn x-large width="50%" text color="green" @click="SalvaEChiudi">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, namespace, State, Getter, Prop } from 'nuxt-property-decorator'

@Component({ components: {}, name: 'keyPad' })
export default class RilievoFori extends Vue {
  index: number = 0
  valore: string = '0'

  setValue(val: string) {
    if (this.valore == '0') {
      this.valore = val as string
    } else {
      this.valore = `${this.valore}${val}`
    }
  }

  deleteOnce() {
    this.valore = this.valore.substring(0, this.valore.length - 1)
    if (this.valore == ''){
      this.valore = "0"
    }
  }

  deleteAll() {
    this.valore = '0'
  }

  SalvaEChiudi() {
    this.$emit('onSave', this.valore)
  }

  annulla() {
    this.$emit('onAbort')
  }

  mounted() {
    this.valore = '0'
  }
}
</script>