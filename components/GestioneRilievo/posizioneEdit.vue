<template>
  <v-dialog v-model="dialog" :max-width="500" @keydown.esc="cancel">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="NomePosizione"
                label="Nome posizione"
                required
                :rules="validazioneNomePos"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="QtaPosizione"
                v-mask="mask"
                label="Quantità"
                hint="Minimo 1"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click.native="agree">Salva</v-btn>
        <v-btn color="grey" text @click.native="cancel">Annulla</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  directives: {
    mask
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    title: null,
    NomePosizione: null,
    QtaPosizione: null,
    mask: '#',

    validazioneNomePos: [(value) => !!value || 'Campo obbligatorio.'],
    validazioneQtaPos: [
      (value) => (!!value && value == 0) || 'Campo obbligatorio.',
      (value) => (value && value > 0) || 'Maggiore di 0'
    ]
  }),
  methods: {
    open(title, nomePos, qtaPos) {
      this.title = title
      this.NomePosizione = nomePos
      this.QtaPosizione = qtaPos
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve({
        NomePosizione: this.NomePosizione,
        QtaPosizione: this.QtaPosizione
      })
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
