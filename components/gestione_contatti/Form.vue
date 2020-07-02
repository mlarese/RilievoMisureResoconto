<template>
  <div>
    <Panel>
      <div slot="toolbarTitle">
        <div v-if="$vuetify.breakpoint.xsOnly">
          <v-row no-gutters>
            <v-col cols="2">
              <v-avatar size="40">
                <v-img :src="require('../../assets/images/contact-placeholder.jpg')"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <div class="subtitle-1 ellipseText">
                <b>{{ $record.data.CONDescrizione }}</b>
              </div>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </div>
        <div v-else>Gestione contatto</div>
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

      <div slot="mainContent" v-if="isView">
        <div v-if="$vuetify.breakpoint.smAndUp">
          <v-row class="mx-2">
            <v-col cols="auto">
              <v-avatar size="75" class="pb-0">
                <v-img :src="getImgPric_asURL()" v-if="getImgPric_asURL()"></v-img>
                <v-img :src="require('../../assets/images/contact-placeholder.jpg')" v-else></v-img>
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
                <b>{{ $record.data.CONDescrizione }}</b>
              </div>
            </v-col>
            <v-col cols="auto" class="pb-0">
              <v-row class="pb-0">
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
          <v-tab>AAA</v-tab>
          <v-tab>BBB</v-tab>

          <v-tab-item
            :class="
              $vuetify.breakpoint.xsOnly
                ? 'tabs__content_small'
                : 'tabs__content_large'
            "
          >
            <DatiAnagrafici />
          </v-tab-item>

          <v-tab-item
            :class="
              $vuetify.breakpoint.xsOnly
                ? 'tabs__content_small'
                : 'tabs__content_large'
            "
          >
            <v-container>
              <EmptyList
                :title="'Nessun documento'"
                :subtitle="
                  'Premere il pulsante in basso per aggiungere nuovi documenti'
                "
                class="mx-auto"
              />
            </v-container>
          </v-tab-item>
          <v-tab-item
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
          </v-tab-item>
        </v-tabs>
      </div>
    </Panel>

    <v-dialog v-model="isDialogErrorVisible" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">App offline</v-card-title>
        <v-card-text>
          Le modifiche a dati già sincronizzati sono ammesse solamente con
          connessione internet attiva.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showDialogErrorOpenEditor = false">OK</v-btn>
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
          <span class="headline">{{ isAdd ? 'Nuovo contatto' : 'Modifica contatto' }}</span>
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
import DatiAnagrafici from '../gestione_contatti/DatiAnagrafici'
import DatiAnagraficiEdit from '../gestione_contatti/DatiAnagrafici_Edit'

const storeName = 'gestione_contatti'

export default {
  components: {
    Panel,
    EmptyList,
    DatiAnagrafici,
    DatiAnagraficiEdit
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
    ...mapState(storeName, ['$record']),
    ...mapGetters(storeName, ['isEdit', 'isAdd', 'isView'])
  },
  methods: {
    openEditForm() {
      // Un nuovo record può essere inserito e modificato anche se offline
      // Ad oggi, se un record è stato sincronizzato, la sua modifica può avvenire solamnte se siamo online
      // Così da evitare conflitti
      if (this.$record.syncStatus == syncStates['NOT_SYNC']) {
        // record non ancora sincronizzato
        // possiamo manipolarlo come ci pare
        // Apre la form di modifica
        this.setEditMode()
      } else {
        // record già sincronizzato
        if (navigator.onLine) {
          // Lo possiamo modificare / salvare solamente se siamo online
          // Apre la form di modifica
          this.setEditMode()
        } else {
          this.isDialogErrorVisible = true
        }
      }
    },
    annullaModifiche() {
      if (this.isAdd) {
        // Ritorna alla pagina precedente
        this.$router.back()
      } else {
        // Rimane nella schermata Form
      }

      // imposta comunque la modalità a sola visualizzazione come defaul
      this.setViewMode()
    },
    async salvaModifiche() {
      if (this.$record.syncStatus == syncStates['NOT_SYNC']) {
        // Provvede a salvare il record
        await this.salvaRecord()
          .then(() => {
            // Andato a bun fine
          })
          .catch((err) => {
            // Errore
          })
        this.setViewMode()
      } else {
        // record già sincronizzato
        if (navigator.onLine) {
          // Prima di salvare delle modifiche in locale dobbiamo inviarle al server
          await this.salvaRecord({ toUpload: true, rawData: false })
          // Imposta la modalità di visualizzazione a READONLY
          this.setViewMode()
        } else {
          this.isDialogErrorVisible = true
        }
      }
    },
    ...mapActions(storeName, {
      salvaRecord: 'save',
      aggiungiImmagine: 'addImgPrinc'
    }),
    ...mapMutations(storeName, ['setEditMode', 'setNewMode', 'setViewMode']),

    exit() {
      this.$router.replace(`/${storeName}`)
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
  },

  mounted() {}
}
</script>
