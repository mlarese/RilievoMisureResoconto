<template>
  <v-form v-model="datiCorretti">
    <v-container>
      <v-text-field v-model="utente.codice" required label="Codice" dense></v-text-field>
      <v-text-field v-model="utente.descrizione" required label="Nominativo" dense></v-text-field>
      <v-text-field v-model="utente.username" required label="Username" dense></v-text-field>
      <v-text-field v-model="utente.password" :required="isAdd" label="Password" dense></v-text-field>
      <v-text-field label="Ripeti password" dense></v-text-field>
    </v-container>
  </v-form>
</template>
<script>
export default {
  props: { utente: { default: {} } },
  data: () => ({
    datiCorretti: false
  })
}
</script>