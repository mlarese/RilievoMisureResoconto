import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
const namespace = 'appuntimm'

export const appuntimm = {
    methods: {
      ...mapActions(namespace, ['addSetImage', 'addPhotocamera', 'cancelPhotocamera', 'addComment', 'getAttachment', 'addImage', 'editAppunto', 'getStrutturaDiClassificazione', 'save', 'cancelAppunto']),
      ...mapMutations(namespace, ['clearEventRecord', 'setEditMode', 'setNewMode', 'setViewMode', 'setLavoroCorrente', 'setFiles', 'showGallery', 'hideGallery']),
      ...mapMutations('app', ['setModalOpened'])
    },
    computed: {
      ...mapGetters('app', ['modalOpened']),
      ...mapGetters(namespace, ['appuntiByDate', 'appuntiFiltered', 'isEdit', 'isAdd', 'isView', 'isBrowserCompleteInputVisible', 'isBrowserLoadImagesVisible']),
      ...mapState(namespace, ['ui', 'lavoroCorrente', 'viewerStatus', '$record', '$files', 'gallery']),
      ...mapState(namespace, {'appuntiList': 'list'})
    }
}
