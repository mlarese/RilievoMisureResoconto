import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
const namespace = 'appuntimm'

export const appuntimm = {
    methods: {
      ...mapActions(namespace, ['addPhotocamera', 'cancelPhotocamera', 'addComment', 'getAttachment', 'addImage', 'editAppunto', 'getStrutturaDiClassificazione', 'save', 'cancelAppunto']),
      ...mapMutations(namespace, ['setEditMode', 'setNewMode', 'setViewMode', 'setLavoroCorrente']),
      ...mapMutations('app', ['setModalOpened'])
    },
    computed: {
      ...mapGetters('app', ['modalOpened']),
      ...mapGetters(namespace, ['appuntiByDate', 'appuntiFiltered', 'isEdit', 'isAdd', 'isView']),
      ...mapState(namespace, ['ui', 'lavoroCorrente', 'viewerStatus', '$record']),
      ...mapState(namespace, {'appuntiList': 'list'})
    }
}
