<template>
  <v-card>
    <v-toolbar :elevation="1" v-if="false">
      <v-toolbar-title>Evento</v-toolbar-title>
    </v-toolbar>
    <v-card-actions>
      <v-row>
        <v-col cols="12">
          <v-text-field  outlined   dense     label="Descrizione"   v-model="$record.data.EV_Descrizione"  hide-details  />
        </v-col>

        <v-col cols="12">
          <v-text-field  outlined   dense     label="Note"   v-model="$record.data.EV_Note" hide-details  />
        </v-col>
        <v-col cols="12">
          <ClassificazioneForm :record="$record.data.EV_Classificazione"/>
        </v-col>
        <v-col cols="12">
          <div class="float-right">
            <v-btn @click.native="onSave" class="mr-3 ">Chiudi</v-btn>
          </div>

        </v-col>
      </v-row>

    </v-card-actions>

  </v-card>
</template>
<script>
import ClassificazioneForm from '../Classificazione/ClassificazioneForm'
import { appuntimm } from './browsermx'

export default {
  mixins: [appuntimm],
  components: {ClassificazioneForm},
  methods: {
    onUndo () { this.$emit('on-undo') },
    onSave () {
      this.save()
    }
  }
}
</script>
