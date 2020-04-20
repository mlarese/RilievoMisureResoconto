<template>
  <v-card flat class="pa-5">
    <v-container>
      <v-row dense>
        <v-col class="align-self-center">
          <v-img :src="require('../../assets/images/casa.jpg')" aspect-ratio="1.5" contain />
        </v-col>
        <v-col >
          <v-card outlined style="border-color:#2979FF">
            <div class="d-flex flex-no-wrap" style="padding: 0 0 0 10px">
              <v-icon x-large color="primary">description</v-icon>
              <div>
                <!-- <v-card-title class="headline">Documenti</v-card-title> -->
                <v-card-subtitle>documenti</v-card-subtitle>
              </div>
            </div>
          </v-card>
          <v-card outlined style="border-color:#2979FF" class="mt-2">
            <div class="d-flex flex-no-wrap" style="padding: 0 0 0 10px">
              <v-icon x-large color="primary">panorama</v-icon>
              <div>
                <!-- <v-card-title class="headline">Galleria</v-card-title> -->
                <v-card-subtitle>galleria</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-text-field
      v-model="$record.committenteDesc"
      label="Committente"
      required
      clearable
      dense
      outlined
      clear-icon="cancel"
      style="margin-top: 20px"
    ></v-text-field>
    <v-text-field
      v-model="$record.descrizione"
      label="Descrizione Lavori"
      required
      clearable
      dense
      outlined
      clear-icon="cancel"
      style="margin-top: -12px"
    ></v-text-field>
    <v-text-field
      v-model="$record.luogo"
      label="Indirizzo"
      required
      dense
      outlined
      clear-icon="cancel"
      style="margin-top: -12px"
    ></v-text-field>
    <v-textarea
      v-model="$record.note"
      label="Note"
      dense
      outlined
      clearable
      clear-icon="cancel"
      style="margin-top: -12px"
    />
    <v-checkbox
      v-model="$record.isPreferito"
      color="primary"
      on-icon="favorite"
      off-icon="favorite_border"
      label="Preferito"
      style="margin-top: -12px"
    />

    <v-btn class="mr-4" color="primary" large @click="onSave()" style="margin-top: -12px">SALVA</v-btn>
    <v-btn large @click="exit()" style="margin-top: -12px">ANNULLA</v-btn>
  </v-card>

  <!--     <v-bottom-navigation grow color="blue accent-3" fixed>
      <v-btn>
        <span>Documenti</span>
        <v-icon>description</v-icon>
      </v-btn>
      <v-btn>
        <span>Galleria</span>
        <v-icon>image</v-icon>
      </v-btn>
  </v-bottom-navigation>-->
</template>

<style>
.v-text__field {
  margin-top: -20px;
}
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

const storeName = 'gestione_lavori'

export default {
  computed: {
    ...mapState('app', ['dark']),
    ...mapState(storeName, ['$record']),
    ...mapGetters(storeName, ['isEdit', 'isAdd']),

    isSalvaImmagineDisabled() {
      return this.takenImage === null
    },
    canSave() {
      if (!this.$record.committenteDesc) return false
      if (!this.$record.descrizione) return false
      return true
    }
  },
  methods: {
    exit() {
      this.$router.back()
    },
    onSave() {
      this.save().then(this.exit)
    },
    ...mapActions(storeName, ['save'])
  }
}
</script>