<template>
  <v-card>
    <v-toolbar flat color="#006080" dense dark>
      <v-btn @click="onCancel" icon class="hidden-xs-only">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ $record.committenteDesc }} - {{ $record.descrizione }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="onSave" :disabled="!canSave" icon class="pr-5">
        <v-icon>mdi-content-save-edit</v-icon>
      </v-btn>
    </v-toolbar>
    <v-tabs vertical>
      <v-tab left>DATI GENERALI</v-tab>
      <v-tab left>RILIEVO</v-tab>
      <v-tab>DOCUMENTI</v-tab>

      <v-tab-item>
        <v-card flat>
          <DxForm :form-data.sync="$record" :col-count="1" label-location="top" class="px-5 py-5">
            <DxGroupItem>
              <DxSimpleItem data-field="committenteDesc" />
              <DxSimpleItem data-field="descrizione" />
              <DxSimpleItem data-field="luogo" />
            </DxGroupItem>
          </DxForm>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <p>Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.</p>
            <p>Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.</p>
            <p>Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.</p>
            <p>Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.</p>
            <p
              class="mb-0"
            >Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.</p>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <p>Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.</p>
            <p
              class="mb-0"
            >Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.</p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>

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

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { saveFile } from '../../assets/allegati'
import { appDirImages, fs } from '../../assets/filesystem'
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
    onPreviewFile(file) {
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
