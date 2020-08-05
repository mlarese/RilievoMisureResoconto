<template>
  <div>
    <v-btn @click="carica">carica</v-btn>

    <ImmagineDet :drawingCommands="dc" :imgWidth="1000" :imgHeight="2000"></ImmagineDet>
  </div>
</template>

<script>
import ImmagineDet from '../../../components/GestioneRilievo/ImmagineDet'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    ImmagineDet
  },
  computed: {
      ...mapState('articoli', ['list'])
  },
  data() {
    return {
      dc: '',
      index: 0
    }
  },
  methods: {
    ...mapActions('articoli', { loadArticoli: 'load' }),
    carica(){
        this.dc = JSON.parse(this.list[0].JSModelli[this.index].JSModPIM)
    }
  },
  mounted() {
    this.loadArticoli()
    //   .then((listArt) => {
    //     this.dc =  listArt[0].JSModelli[0].JSModPIM
    //   })
  }
}
</script>