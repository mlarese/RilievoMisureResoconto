<template>
  <Panel
    :title="isAdd?'Nuovo lavoro':$record.committenteDesc"
    :subtitle="isAdd?'':$record.descrizione"
  >
    <!--   <v-card>
    <v-toolbar flat color="blue accent-3" dense dark>
      <div>
        <v-btn @click="dialog=false" icon class="hidden-xs-only">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-toolbar-title>{{ $record.committenteDesc }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="onSave" :disabled="!canSave" icon class="pr-5">
        <v-icon>save</v-icon>
      </v-btn>
    </v-toolbar>-->
    <v-tabs>
      <v-tab>DETTAGLIO</v-tab>
      <v-tab>DOCUMENTI</v-tab>
      <v-tab>GALLERIA</v-tab>

      <v-tab-item :touchless="true" class="tabs__content">
        <FormDatiGenerali />
      </v-tab-item>
      <v-tab-item :touchless="true" class="tabs__content">
           <v-container style="height: 80vh;" class="d-flex align-content-center" >
          <EmptyList
            :title="'Nessun documento'"
            :subtitle="'Premere il pulsante in basso per aggiungere nuovi documenti'"
          />
        </v-container>
      </v-tab-item>
      <v-tab-item :touchless="true" class="tabs__content">
        <v-container style="height: 80vh;" class="d-flex align-content-center" >
          <EmptyList
            :title="'Nessuna immagine'"
            :subtitle="'Premere il pulsante in basso per aggiungere nuove immagini'"
          />
        </v-container>
      </v-tab-item>
    </v-tabs>
  </Panel>
  <!--  </v-card> -->

  <!-- <Panel :title="tmpFormTitle" :subtitle="isAdd?'':$record.committenteDesc + ': ' + $record.descrizione" >
    <DxForm :form-data.sync="$record" :col-count="1" label-location="top" v-if="isFormVisible">
      <DxGroupItem>
          <DxSimpleItem data-field="committenteDesc" />
          <DxSimpleItem data-field="descrizione" />
          <DxSimpleItem data-field="luogo" />
      </DxGroupItem>
    </DxForm>

    <FileManager :entry-point="$record._id" :preview-visible="isPreviewVisible" @on-preview-file="onPreviewFile" v-if="isFileManagerVisible" />

    <PhotoCamera v-if="isEdit && isCameraVisible" @snap-photo="onSnapPhoto" class="mt-2" />

    <v-bottom-navigation app :dark="dark">
          <div v-if="isFormVisible">
              <v-btn value="save" @click="onSave" :disabled="!canSave">
                  <span>Salva</span>
                  <v-icon>mdi-content-save-edit</v-icon>
              </v-btn>

              <v-btn value="cancel" @click="onCancel">
                  <span>Esci</span>
                  <v-icon>mdi-undo</v-icon>
              </v-btn>
          </div>

           <div v-if="isCameraVisible">
               <v-btn value="save" @click="onSaveImg" :disabled="isSalvaImmagineDisabled">
                   <span>Salva Immagine</span>
                   <v-icon>mdi-content-save-edit</v-icon>
               </v-btn>
           </div>

          <v-spacer></v-spacer>

            <v-btn v-if="isEdit && isFormVisible" value="fotocamera" @click="setVisible('isCameraVisible')">
                <span>Fotocamera</span>
                <v-icon>mdi-camera</v-icon>
            </v-btn>

            <v-btn v-if="isEdit && isFormVisible" value="fotocamera" @click="apriRilievo()">
                <span>rilievo</span>
                <v-icon>mdi-camera</v-icon>
            </v-btn>

          <v-btn v-if="isEdit && isFormVisible" value="allegati" @click="setVisible('isFileManagerVisible')">
              <span>Allegati</span>
              <v-icon>mdi-file-cabinet</v-icon>
          </v-btn>


          <v-btn v-if="!isFormVisible" value="chiudi"
                 @click="onClose">
                <span>Chiudi</span>
                <v-icon>mdi-close</v-icon>
          </v-btn>


     </v-bottom-navigation>

  </Panel>-->
</template>

<style>
.tabs__content {
  min-height: 100vh;
}
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { appDirImages, fs } from '../../assets/filesystem'

import Panel from '../Containers/Panel'
import ConfirmDialog from '../General/ConfirmDialog'
import EmptyList from '../General/EmptyList'
import FormDatiGenerali from '../GestioneLavori/Form_DatiGenerali'

const storeName = 'gestione_lavori'

export default {
  components: {
    ConfirmDialog,
    EmptyList,
    Panel,
    FormDatiGenerali
  },
  data() {
    return {
      isPreviewVisible: false,
      isFileManagerVisible: false,
      isCameraVisible: false,
      isFormVisible: true,
      takenImage: null
    }
  },
  methods: {
    apriRilievo(){
      const {_id} = this.$record
      this.$router.push(`/rilievo/${_id}`)
    },
    onPreviewFile (file) {
      this.isPreviewVisible = true
    },
    onSnapPhoto(file) {
      this.takenImage = file
    },
    setVisible(flag) {
      this.isFileManagerVisible = false
      this.isCameraVisible = false
      this.isFormVisible = false

      this[flag] = true
    },
    exit() {
      this.$router.replace(`/${storeName}`)
    },
    onCancel() {
      if (!confirm('Confermi?')) return
      this.exit()
    },
    onSaveImg() {
      const { _id } = this.$record
      saveFile(this.takenImage, appDirImages(_id), fs, this.$store)
      this.setVisible('isFileManagerVisible')
    },
    onClose() {
      if (!this.isPreviewVisible) this.setVisible('isFormVisible')
      else this.isPreviewVisible = false
    },
    onSave() {
      this.save().then(this.exit)
    },
    ...mapActions(storeName, ['save'])
  },
  computed: {
    ...mapState('app', ['dark']),
    ...mapState(storeName, ['$record']),
    ...mapGetters(storeName, ['formTitle', 'isEdit', 'isAdd']),
    isSalvaImmagineDisabled() {
      return this.takenImage === null
    },
    tmpFormTitle() {
      if (this.isFileManagerVisible) return `${this.formTitle} - Allegati`
      return this.formTitle
    },
    canSave() {
      if (!this.$record.committenteDesc) return false
      if (!this.$record.descrizione) return false
      return true
    }
  }
}
</script>
