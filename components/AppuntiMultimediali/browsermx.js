import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
const namespace = 'appuntimm'

export const appuntimm = {
    methods: {
      ...mapActions(namespace, ['addComment', 'getAttachment', 'addImage']),
      ...mapMutations(namespace, ['setLavoroCorrente', 'setViewerStatusLoadImage', 'setViewerStatusView'])
    },
    computed: {
      ...mapGetters(namespace, ['appuntiByDate']),
      ...mapState(namespace, ['ui', 'lavoroCorrente', 'viewerStatus']),
      ...mapState(namespace, {'appuntiList': 'list'})
    }
}
