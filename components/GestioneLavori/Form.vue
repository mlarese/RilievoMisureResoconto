<template>
  <Panel :title="formTitle">
    <DxForm :form-data.sync="$record" :col-count="1" label-location="top">
      <DxGroupItem>
          <DxSimpleItem data-field="committenteDesc" />
          <DxSimpleItem data-field="descrizione" />
          <DxSimpleItem data-field="luogo" />
      </DxGroupItem>
    </DxForm>

    <!-- v-layout rows wrap class=" mt-4">
        <v-flex xs12 class="align-right">
            <DxButton icon="undo" text="Annulla" @click="onCancel"/>
            <DxButton icon="save" text="Salva" @click="onSave" :disabled="!canSave" />
         </v-flex>
    </v-layout -->


      <v-bottom-navigation app>
          <v-btn value="save" @click="onSave" :disabled="!canSave">
              <span>Salva</span>
              <v-icon>mdi-content-save-edit</v-icon>
          </v-btn>

          <v-btn value="cancel" @click="onCancel">
              <span>Annulla</span>
              <v-icon>mdi-undo</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn value="allegati" class="">
              <span>Allegati</span>
              <v-icon>mdi-attachment</v-icon>
          </v-btn>
      </v-bottom-navigation>

  </Panel>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import Panel from '../Containers/Panel'
import { DxButton, DxSpeedDialAction } from 'devextreme-vue'
import {
  DxForm,
  DxSimpleItem,
  DxGroupItem,
  DxLabel,
  DxButtonItem
} from 'devextreme-vue/form'

const storeName = 'gestione_lavori'

export default {
  components: {
    DxForm,
    DxSimpleItem,
    DxGroupItem,
    DxLabel,
    Panel,
    DxButtonItem,
    DxSpeedDialAction,
    DxButton
  },
  methods: {
    onShowAttachments () {

    },
    exit () {
      this.$router.replace(`/${storeName}`)
    },
    onCancel () {
      if(!confirm('Confermi?')) return
      this.exit()
    },
    onSave () {
      this.save()
        .then(this.exit)
    },
    ...mapActions(storeName, ['save'])
  },
  computed: {
    ...mapState(storeName, ['$record']),
    ...mapGetters(storeName, ['formTitle']),
    canSave () {
      if(!this.$record.committenteDesc) return false
      if(!this.$record.descrizione) return false
      return true
    }
  }
}

</script>
