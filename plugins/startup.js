import Vue from 'vue'
import Notifications from 'vue-notification'
import itMessages from 'devextreme/localization/messages/it';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
// import { DxDataGrid, DxColumn, DxEditing, DxFilterRow, DxPaging, DxScrolling } from 'devextreme-vue/data-grid'
import { DxButton, DxButtonGroup } from 'devextreme-vue'
import BottomNavigation from '../layouts/BottomNavigation'
locale('it')
loadMessages(itMessages)
Vue.use(Notifications)
// Vue.component('DxDataGrid', DxDataGrid)
// Vue.component('DxColumn', DxColumn)
// Vue.component('DxEditing', DxEditing)
// Vue.component('DxFilterRow', DxFilterRow)
// Vue.component('DxPaging', DxPaging)
// Vue.component('DxScrolling', DxScrolling)
Vue.component('DxButton', DxButton)
Vue.component('DxButtonGroup', DxButtonGroup)
Vue.component('BottomNavigation', BottomNavigation)

export default async ({ app }) => {
  return await app.store.dispatch('auth/persistentUser', {}, {root: true})
}
