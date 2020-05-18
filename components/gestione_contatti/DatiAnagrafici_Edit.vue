<template>
  <v-card flat>
    <v-text-field
      v-model="$record.data.CONDescrizione"
      label="Descrizione"
      required
      dense
      :readonly="isView"
      class="py-2"
    ></v-text-field>
    <v-text-field
      v-model="$record.data.CONIndirizzo"
      label="Indirizzo"
      required
      dense
      :readonly="isView"
      class="py-2"
    ></v-text-field>
    <v-text-field
      v-model="$record.data.CONTelefono"
      label="Telefono"
      required
      dense
      :readonly="isView"
      class="py-2"
    ></v-text-field>
    <v-textarea
      v-model="$record.data.CONNote"
      label="Note"
      dense
      :readonly="isView"
      class="py-2"
    />
  </v-card>
</template>

<style>
.v-text__field {
  margin-top: -20px;
}
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

const storeName = 'gestione_contatti'

export default {
  computed: {
    ...mapState('app', ['dark']),
    ...mapState(storeName, ['$record']),
    ...mapGetters(storeName, ['isEdit', 'isAdd', 'isView']),
    canSave() {
      if (!this.$record.data.CONDescrizione) return false
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
