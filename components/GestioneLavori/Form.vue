<template>
  <Panel :title="tmpFormTitle" :subtitle="isAdd?'':$record.committenteDesc + ': ' + $record.descrizione">
    <DxForm :form-data.sync="$record" :col-count="1" label-location="top" v-if="!isFileManagerVisible">
      <DxGroupItem>
          <DxSimpleItem data-field="committenteDesc" />
          <DxSimpleItem data-field="descrizione" />
          <DxSimpleItem data-field="luogo" />
      </DxGroupItem>
    </DxForm>

    <FileManager v-if="isFileManagerVisible" />


      <v-bottom-navigation app>
          <div v-if="!isFileManagerVisible">
              <v-btn value="save" @click="onSave" :disabled="!canSave">
                  <span>Salva</span>
                  <v-icon>mdi-content-save-edit</v-icon>
              </v-btn>

              <v-btn value="cancel" @click="onCancel">
                  <span>Annulla</span>
                  <v-icon>mdi-undo</v-icon>
              </v-btn>
          </div>

          <v-spacer></v-spacer>

          <v-btn v-if="isEdit" value="allegati" class="clos" @click="isFileManagerVisible=!isFileManagerVisible">
              <span v-if="!isFileManagerVisible">Allegati</span>
              <v-icon v-if="!isFileManagerVisible">mdi-file-cabinet</v-icon>


              <span v-if="isFileManagerVisible">Chiudi</span>
              <v-icon v-if="isFileManagerVisible">mdi-close</v-icon>
          </v-btn>
      </v-bottom-navigation>

  </Panel>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import Panel from '../Containers/Panel'
import FileManager from '../FileManager/FileManager'
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
    FileManager,
    DxForm,
    DxSimpleItem,
    DxGroupItem,
    DxLabel,
    Panel,
    DxButtonItem,
    DxSpeedDialAction,
    DxButton
  },
  data () {
    return {isFileManagerVisible: false}
  },
  methods: {
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
    ...mapGetters(storeName, ['formTitle', 'isEdit', 'isAdd']),
    tmpFormTitle () {
      if(this.isFileManagerVisible) return `${this.formTitle} - Allegati`
      return this.formTitle
    },
    canSave () {
      if(!this.$record.committenteDesc) return false
      if(!this.$record.descrizione) return false
      return true
    }
  }
}

</script>
