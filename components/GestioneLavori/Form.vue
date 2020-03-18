<template>
  <Panel :title="tmpFormTitle" :subtitle="isAdd?'':$record.committenteDesc + ': ' + $record.descrizione">
    <DxForm :form-data.sync="$record" :col-count="1" label-location="top" v-if="isFormVisible">
      <DxGroupItem>
          <DxSimpleItem data-field="committenteDesc" />
          <DxSimpleItem data-field="descrizione" />
          <DxSimpleItem data-field="luogo" />
      </DxGroupItem>
    </DxForm>

    <FileManager v-if="isFileManagerVisible" />


    <PhotoCamera v-if="isEdit && isCameraVisible" @snap-photo="onSnapPhoto" class="mt-2" />

    <v-bottom-navigation app>
          <div v-if="isFormVisible">
              <v-btn value="save" @click="onSave" :disabled="!canSave">
                  <span>Salva</span>
                  <v-icon>mdi-content-save-edit</v-icon>
              </v-btn>

              <v-btn value="cancel" @click="onCancel">
                  <span>Annulla</span>
                  <v-icon>mdi-undo</v-icon>
              </v-btn>
          </div>

           <div v-if="isCameraVisible">
               <v-btn value="save" @click="onSave" :disabled="isSalvaImmagineDisabled">
                   <span>Salva Immagine</span>
                   <v-icon>mdi-content-save-edit</v-icon>
               </v-btn>
           </div>

          <v-spacer></v-spacer>

            <v-btn v-if="isEdit && isFormVisible" value="fotocamera" @click="setVisible('isCameraVisible')">
                <span>Fotocamera</span>
                <v-icon>mdi-camera</v-icon>
            </v-btn>

          <v-btn v-if="isEdit && isFormVisible" value="allegati" @click="setVisible('isFileManagerVisible')">
              <span>Allegati</span>
              <v-icon>mdi-file-cabinet</v-icon>
          </v-btn>


          <v-btn v-if="!isFormVisible" value="chiudi" @click="setVisible('isFormVisible')">
                <span>Chiudi</span>
                <v-icon>mdi-close</v-icon>
          </v-btn>


     </v-bottom-navigation>

  </Panel>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import Panel from '../Containers/Panel'
import PhotoCamera from '../Photo/PhotoCamera'
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
    PhotoCamera,
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
    return {
      isFileManagerVisible: false,
      isCameraVisible: false,
      isFormVisible: true,
      takenImage: null
    }
  },
  methods: {
    onSnapPhoto (file) {
      this.takenImage = file
    },
    setVisible (flag) {
        this.isFileManagerVisible = false
        this.isCameraVisible = false
        this.isFormVisible = false

        this[flag] = true

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
    ...mapGetters(storeName, ['formTitle', 'isEdit', 'isAdd']),
    isSalvaImmagineDisabled() {
      return this.takenImage === null
    },
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
