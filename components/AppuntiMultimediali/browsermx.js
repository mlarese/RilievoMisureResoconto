import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
const namespace = 'appuntimm'

export const appuntimm = {
    methods: {
      ...mapActions(namespace, ['addComment', 'getAttachment', 'addImage', 'editAppunto', 'getStrutturaDiClassificazione', 'save']),
      ...mapMutations(namespace, ['setLavoroCorrente', 'setViewerStatusLoadImage', 'setViewerStatusView', 'setEventoEditStatusEditor', 'setEventoEditStatusNone'])
    },
    computed: {
      ...mapGetters(namespace, ['appuntiByDate', 'appuntiFiltered']),
      ...mapState(namespace, ['ui', 'lavoroCorrente', 'viewerStatus', '$record']),
      ...mapState(namespace, {'appuntiList': 'list'})
    }
}
