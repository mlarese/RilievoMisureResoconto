import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
const namespace = 'appuntimm'

export const appuntimm = {
    methods: {
      ...mapActions(namespace, ['addComment', 'getAttachment']),
      ...mapMutations(namespace, ['setLavoroCorrente'])
    },
    computed: {
      ...mapGetters(namespace, ['appuntiByDate']),
      ...mapState(namespace, ['ui', 'lavoroCorrente']),
      ...mapState(namespace, {'appuntiList': 'list'})
    }
}
