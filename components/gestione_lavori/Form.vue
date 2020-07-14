<template>
  <div>
    <Panel>
      <div slot="toolbarTitle">
        <div v-if="$vuetify.breakpoint.xsOnly">
          <div class="d-flex justify-start align-center">
            <div>
              <v-avatar size="40" class="pa-0 ma-0">
                <v-img :src="ui.imgURL || require('../../assets/images/lavoro.png')"></v-img>
              </v-avatar>
            </div>
            <div class="pl-1">
              <div class="subtitle-1 ellipseText">
                <b>{{ $record.data.GL_CommittenteDesc }}</b>
              </div>
              <div class="caption ellipseText">{{ $record.data.GL_Oggetto }}</div>
            </div>
          </div>
        </div>
        <div v-else>Gestione lavoro</div>
      </div>
      <v-btn
        icon
        class="mr-1"
        @click="openEditForm()"
        slot="panelToolbarRight"
        v-if="$vuetify.breakpoint.xsOnly"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <div v-show="!modalOpened" slot="mainContent">
        <div v-if="isView">
          <div v-if="$vuetify.breakpoint.smAndUp">
            <v-row class="mx-2">
              <v-col cols="auto">
                <v-avatar size="75" class="pb-0">
                  <v-img :src="getImgPric_asURL()" v-if="getImgPric_asURL()"></v-img>
                  <v-img :src="require('../../assets/images/lavoro.png')" v-else></v-img>
                  <input
                    type="file"
                    @change="
                      filesChange($event.target.name, $event.target.files)
                      fileCount = $event.target.files.length
                    "
                    accept="image/*"
                    class="input-file"
                  />
                </v-avatar>
              </v-col>
              <v-col class="align-self-center">
                <div class="title ellipseText">
                  <b>{{ $record.data.GL_CommittenteDesc }}</b>
                </div>
                <div class="subtitle-1 ellipseText">{{ $record.data.GL_Oggetto }}</div>
              </v-col>
              <v-col cols="auto" class="pb-0">
                <v-row class="pb-0">
                  <v-col cols="2" class="align-self-center">
                    <v-checkbox
                      v-model="$record.data.isPreferito"
                      color="primary"
                      on-icon="favorite"
                      off-icon="favorite_border"
                    />
                  </v-col>
                  <v-col cols="2" class="align-self-center">
                    <v-btn icon color="primary" @click="openEditForm()">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="2" class="align-self-center">
                    <v-btn icon color="primary">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>
          <v-tabs centered>
            <v-tab>INFO</v-tab>
            <v-tab>RILIEVI</v-tab>
            <v-tab>MEDIA</v-tab>
            <!-- <v-tab>FOTO</v-tab> -->

            <v-tab-item
              :touchless="true"
              :class="
                $vuetify.breakpoint.xsOnly
                  ? 'tabs__content_small'
                  : 'tabs__content_large'
              "
            >
              <DatiAnagrafici />
            </v-tab-item>

            <v-tab-item
              :touchless="true"
              :class="
                $vuetify.breakpoint.xsOnly
                  ? 'tabs__content_small'
                  : 'tabs__content_large'
              "
            >
              <ListaRilievi :rifLavoroID="$record._id" />
            </v-tab-item>
            <v-tab-item
              :touchless="true"
              :class="
                $vuetify.breakpoint.xsOnly
                  ? 'tabs__content_small'
                  : 'tabs__content_large'
              "
            >
              <v-container>
                <Browser class="overflow-hidden" :job="{ job_id: $record._id }" />
              </v-container>
            </v-tab-item>
            <!-- <v-tab-item
              :class="
                $vuetify.breakpoint.xsOnly
                  ? 'tabs__content_small'
                  : 'tabs__content_large'
              "
            >
              <v-container>
                <EmptyList
                  :title="'Nessuna immagine'"
                  :subtitle="
                    'Premere il pulsante in basso per aggiungere nuove immagini'
                  "
                  class="mx-auto"
                />
              </v-container>
            </v-tab-item>-->
          </v-tabs>
        </div>
      </div>
    </Panel>

    <v-dialog v-model="isDialogErrorVisible" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">App offline</v-card-title>
        <v-card-text>
          Le modifiche a lavori già sincronizzati sono ammesse solamente con
          connessione internet attiva.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="isDialogErrorVisible = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :value="isEdit || isAdd"
      persistent
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="700px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ isAdd ? 'Nuovo lavoro' : 'Modifica lavoro' }}</span>
        </v-card-title>

        <v-card-text>
          <DatiAnagraficiEdit />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="annullaModifiche()">Annulla</v-btn>
          <v-btn color="blue darken-1" text @click="salvaModifiche()">Salva</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :value="isBrowserCompleteInputVisible"
      persistent
      :fullscreen="$vuetify.breakpoint.xsOnly"
      max-width="700px"
    >
      <BrowserCompleteInput class="pa-2" />
    </v-dialog>

    <v-dialog :value="isBrowserLoadImagesVisible" persistent  :fullscreen="$vuetify.breakpoint.xsOnly"   max-width="700px" >
      <BrowserLoadImages class="pa-2" />
    </v-dialog>

  </div>
</template>

<style scoped>
.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
}
.ellipseText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabs__content_small {
  height: calc(100vh - 110px);
  overflow: auto;
}
.tabs__content_large {
  min-height: 200px;
  max-height: calc(100vh - 250px);
  overflow: auto;
}
</style>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { appDirImages, fs } from '../../assets/filesystem'
import { syncStates, internalStates } from '../../store/db'

import Panel from '../Containers/Panel'
import EmptyList from '../General/EmptyList'
import DatiAnagrafici from '../gestione_lavori/DatiAnagrafici'
import DatiAnagraficiEdit from '../gestione_lavori/DatiAnagrafici_Edit'
import ListaRilievi from '../GestioneRilievo/listaRilievi'
import Browser from "~/components/AppuntiMultimediali/Browser"
import BrowserCompleteInput from "~/components/AppuntiMultimediali/BrowserCompleteInput"
import BrowserLoadImages from "~/components/AppuntiMultimediali/BrowserLoadImages"

const storeName = 'gestione_lavori'

export default {
  components: {
    Panel,
    EmptyList,
    DatiAnagrafici,
    DatiAnagraficiEdit,
    ListaRilievi,
    BrowserCompleteInput,
    BrowserLoadImages,
    Browser
  },
  data() {
    return {
      isDialogErrorVisible: false,
      isPreviewVisible: false,
      isFileManagerVisible: false,
      isCameraVisible: false,
      isFormVisible: true,
      takenImage: null
    }
  },
  computed: {
    ...mapState('app', ['modalOpened']),
    ...mapState(storeName, ['$record', 'ui']),
    ...mapGetters('appuntimm', ['isBrowserCompleteInputVisible', 'isBrowserLoadImagesVisible']),
    ...mapGetters(storeName, ['isEdit', 'isAdd', 'isView', 'getImg'])
  },
  methods: {
    ...mapMutations(storeName, ['setEditMode', 'setNewMode', 'setViewMode']),
    openEditForm() {
      // Un nuovo lavoro può essere inserito e modificato anche se offline
      // Ad oggi, se un lavoro è stato sincronizzato, la sua modifica può avvenire solamnte se siamo online
      // Così da evitare conflitti
      if (this.$record.syncStatus == syncStates['NOT_SYNC']) {
        // Lavoro non ancora sincronizzato
        // possiamo manipolarlo come ci pare
        this.setEditMode() // Apre la form di modifica
      } else {
        // lavoro già sincronizzato
        if (navigator.onLine) {
          // siamo online
          this.setEditMode() // Apre la form di modifica
        } else {
          this.isDialogErrorVisible = true // mostra messaggio di errore
        }
      }
    },
    annullaModifiche() {
      if (this.isAdd) {
        // Ritorna alla pagina precedente
        this.$router.back()
      } else {
        // Rimane nella schermata del lavoro
      }

      // imposta comunque la modalità a sola visualizzazione come defaul
      this.setViewMode()
    },
    async salvaModifiche() {
      // Effettua un ulteriore verifica in quanto portebbe essere caduta la connessione
      if (this.$record.syncStatus == syncStates['NOT_SYNC']) {
        await this.salvaLavoro() // Provvede a salvare il lavoro
          .then() // Andato a bun fine
          .catch((err) => {
            // Errore dobbiamo prevedere una schermata di errore
          })

        this.setViewMode()
      } else {
        // lavoro già sincronizzato
        if (navigator.onLine) {
          await this.salvaLavoro() // Prima invia il record al ws poi salva localmente
          this.setViewMode() // Imposta la modalità di visualizzazione a READONLY
        } else {
          this.isDialogErrorVisible = true // mostra errore
        }
      }
    },
    ...mapActions(storeName, {
      salvaLavoro: 'save',
      UploadESaveLavoro: 'upload',
      aggiungiImmagine: 'addImgPrinc'
    }),

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
    },
    filesChange(fieldName, fileList) {
      if (!fileList.length) return
      const myFile = fileList[0]
      this.aggiungiImmagine(myFile)
    },
    getImgPric_asURL() {
      let imgUrl = ''
      const allegatiDelRecord = this.$record._attachments
      const fileNameImmagineLavoro = this.$record.data.imgFileName
      if (allegatiDelRecord && fileNameImmagineLavoro) {
        if (allegatiDelRecord.hasOwnProperty(fileNameImmagineLavoro)) {
          const myAllegato = allegatiDelRecord[fileNameImmagineLavoro]
          if (myAllegato && myAllegato.data) {
            imgUrl =
              'data:' + myAllegato.content_type + ';base64,' + myAllegato.data
          }
        }
      }
      return imgUrl
    }
  }
}
</script>
