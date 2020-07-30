<template>
  <v-card flat>
    <v-checkbox
      v-model="$record.data.isPreferito"
      color="primary"
      on-icon="favorite"
      off-icon="favorite_border"
      label="Preferito"
      :readonly="isView"
    />

    <v-text-field
      v-model="$record.data.GL_CommittenteDesc"
      label="Committente"
      dense
      :readonly="isView"
      :rules="[rules.required]"
      class="py-2"
    ></v-text-field>
    <v-text-field
      v-model="$record.data.GL_Oggetto"
      label="Descrizione Lavori"
      dense
      :readonly="isView"
      :rules="[rules.required]"
      class="py-2"
    ></v-text-field>
    <v-text-field
      v-model="$record.data.GL_Indirizzo"
      label="Indirizzo"
      dense
      :readonly="isView"
      class="py-2"
    ></v-text-field>
    <v-text-field
      v-model="$record.data.GL_Telefono"
      label="Telefono"
      dense
      :readonly="isView"
      class="py-2"
    ></v-text-field>
    <v-textarea v-model="$record.data.GL_Note" label="Note" dense :readonly="isView" class="py-2" />

    <!-- <v-btn
      class="mr-4"
      color="primary"
      large
      @click="onSave()"
      style="margin-top: -12px"
      >SALVA</v-btn
    >
    <v-btn large @click="exit()" style="margin-top: -12px">ANNULLA</v-btn>-->
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
import { rules } from '../../assets/rules'

const storeName = 'gestione_lavori'

export default {
  props: {
    // editable: { type: Boolean, default: false }
  },
  data() {
    return {
      rules
    }
  },
  computed: {
    ...mapState('app', ['dark']),
    ...mapState(storeName, ['$record']),
    ...mapGetters(storeName, ['isEdit', 'isAdd', 'isView']),

    isSalvaImmagineDisabled() {
      return this.takenImage === null
    },
    canSave() {
      if (!this.$record.data.GL_CommittenteDesc) return false
      if (!this.$record.data.GL_Oggetto) return false
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
    ...mapActions(storeName, ['save']),
    openGoogleMap() {
      window.open('https://goo.gl/maps/5vn9uhm7x6gavZ699', '_blank')
    }
  }
}
</script>
