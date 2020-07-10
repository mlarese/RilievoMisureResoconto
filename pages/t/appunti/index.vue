<template>
    <BrowserCompleteInput :appunto="appunto" @on-save="salvaAppunto" @on-undo="annullaAppunto"/>
</template>

<script>
import BrowserCompleteInput from "../../../components/AppuntiMultimediali/BrowserCompleteInput"
import {syncStates} from "~/store/db";

export default {
  components: { BrowserCompleteInput },
  methods: {
    salvaAppunto () {

    },
    annullaAppunto () {

    }
  },
  data () {
    return {
      appunto:  {
        _id: null,
        tipo: 'EVENTO',
        syncStatus: syncStates['NOT_SYNC'],
        lastUpdate_UTCDate: new Date(),
        insert_UTCDate: new Date(),
        lastUpdateUser: '',
        insertUser: '',
        data: {
          EV_Type: 'comment',
          EV_RifLavoroID: 'ddd-fff-ggg-rrr',
          EV_Descrizione: 'comment',
          EV_Note: null,
          EV_Classificazione: null,
        },
        listaRisorse: []
      }
    }
  },
  async fetch ({store}) {
    await store.dispatch('appuntimm/getStrutturaDiClassificazione',null, {root: true})
  }
}
</script>
