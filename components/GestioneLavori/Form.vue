<template>
  <Panel
    :title="isAdd ? 'Nuovo lavoro' : isEdit ? 'Modifica lavoro' : $record.committenteDesc"
    :subtitle="isAdd ? ''  : isEdit ? '' : $record.descrizione"

    @editClick="onEditClick"
  >
    <v-btn icon class="mr-1" @click="onEditClick()" slot="panelToolbarRight">
      <v-icon>mdi-{{ isView ? 'pencil' : 'check-bold' }}</v-icon>
    </v-btn>

    <FormDatiGenerali slot="back" />

    <v-card slot="slider" v-show="isView">
      <v-tabs fixed-tabs>
        <v-tab>RILIEVO</v-tab>
        <v-tab>DOCUMENTI</v-tab>
        <v-tab>GALLERIA</v-tab>

        <v-tab-item :touchless="true" class="tabs__content">
          <Rilievo />
        </v-tab-item>
        <v-tab-item :touchless="true" class="tabs__content">
          <v-container
            style="height: 80vh;"
            class="d-flex align-content-center"
          >
            <EmptyList
              :title="'Nessun documento'"
              :subtitle="
                'Premere il pulsante in basso per aggiungere nuovi documenti'
              "
            />
          </v-container>
        </v-tab-item>
        <v-tab-item :touchless="true" class="tabs__content">
          <v-container
            style="height: 80vh;"
            class="d-flex align-content-center"
          >
            <EmptyList
              :title="'Nessuna immagine'"
              :subtitle="
                'Premere il pulsante in basso per aggiungere nuove immagini'
              "
            />
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </Panel>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { appDirImages, fs } from '../../assets/filesystem'

import Panel from '../Containers/Panel'
import ConfirmDialog from '../General/ConfirmDialog'
import EmptyList from '../General/EmptyList'
import FormDatiGenerali from '../GestioneLavori/Form_DatiGenerali'
import Rilievo from '../GestioneRilievo/Rilievo'
const storeName = 'gestione_lavori'

export default {
  components: {
    ConfirmDialog,
    EmptyList,
    Panel,
    FormDatiGenerali,
    Rilievo
  },
  data() {
    return {
      isPreviewVisible: false,
      isFileManagerVisible: false,
      isCameraVisible: false,
      isFormVisible: true,
      takenImage: null,
      expanded: false
    }
  },
  computed: {
    ...mapState('app', ['dark']),
    ...mapState(storeName, ['$record']),
    ...mapGetters(storeName, ['formTitle', 'isEdit', 'isAdd', 'isView'])
  },
  methods: {
    ...mapActions(storeName, { salvaLavoro: 'save' }),
    ...mapMutations(storeName, ['setEditMode', 'setNewMode', 'setViewMode']),
    onEditClick() {
      // Un nuovo lavoro può essere inserito e modificato anche se offline
      // Ad oggi, se un lavoro è stato sincronizzato, la sua modifica può avvenire solamnte se siamo online
      // Così da evitare conflitti
      if (this.$record.agileID == null || this.$record.agileID == 0) {
        // Lavoro non ancora sincronizzato
        // possiamo manipolarlo come ci pare

        if (this.isView) {
          // Imposta la modalità di visualizzazione a EDITABLE
          this.setEditMode()
        } else {
          // Provvede a salvare il lavoro
          this.salvaLavoro()

          // Imposta la modalità di visualizzazione a READONLY
          this.setViewMode()
        }
      } else {
        // lavoro già sincronizzato
        if (navigator.onLine) {
          // Lo possiamo modificare / salvare solamente se siamo online

          if (this.isView) {
            // Imposta la modalità di visualizzazione a EDITABLE
            this.setEditMode()
          } else {
            // Provvede a salvare il lavoro
            this.salvaLavoro()

            // Imposta la modalità di visualizzazione a READONLY
            this.setViewMode()
          }
        } else {
          alert('Quando offline non è possibile modificare un lavoro!')
        }
      }
      this.expanded = false
    },

    apriRilievo() {
      const { _id } = this.$record
      this.$router.push(`/rilievo/${_id}`)
    },
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
    }
  },

  mounted() {}
}
</script>
