<template>
  <v-card>
    <v-toolbar dense dark="dark" color="primary">
      Nuovo rilievo
    </v-toolbar>
    <v-card-text class="pt-5">
      <v-text-field v-model="rilievo.descrizione" label="Inserire una descrizione" required></v-text-field>

      <v-select v-model="rilievo.tipo" :items="tipiRilievo" hide-details label="Tipo rilievo" outlined dense item-text="value" item-value="key"></v-select>
    </v-card-text>

    <v-card-actions class="py-0">
      <v-card-subtitle>
        Avanzate
      </v-card-subtitle>
      <v-spacer></v-spacer>

      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          <v-dialog ref="dialog" v-model="modal" :return-value.sync="rilievo.dataConsegna" persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="rilievo.dataConsegna"
                label="Data indicativa di consegna"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="rilievo.dataConsegna" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">
                Annulla
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(rilievo.dataConsegna)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>

          <v-textarea hide-details clearable rows="2" clear-icon="mdi-close-circle" label="Annotazioni aggiuntive" v-model="rilievo.note"></v-textarea>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="annullaModifiche()">Annulla</v-btn>
      <v-btn color="blue darken-1" text @click="salvaModifiche()">Crea</v-btn>
    </v-card-actions>
  </v-card>
</template>


<script lang="ts">
import { Vue, Component, namespace, State, Getter, Emit, Prop } from 'nuxt-property-decorator'
import { RilievoRecord, RilievoUI } from '@/store/rilievoModule'

@Component({ components: {}, name: 'wizardSchede' })
export default class WizardSchede extends Vue {
  @Prop({ type: Object, default: {} }) rilievo!: {}
  tipiRilievo = [
    { key: 1, value: 'Preliminare' },
    { key: 2, value: 'Variante' },
    { key: 3, value: 'Definitivo' }
  ]
  modal = false
  show= false

  annullaModifiche() {
    this.$emit('onAbort')
  }

  salvaModifiche() {
    this.$emit('onSave')
  }
}
</script>