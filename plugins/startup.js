import Vue from 'vue'
import Notifications from 'vue-notification'
import itMessages from 'devextreme/localization/messages/it';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
// import { DxDataGrid, DxColumn, DxEditing, DxFilterRow, DxPaging, DxScrolling } from 'devextreme-vue/data-grid'
import { DxButton, DxButtonGroup } from 'devextreme-vue'
import BottomNavigation from '../layouts/BottomNavigation'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {dmy, time, truncate,number} from '../assets/filters'

// import LogRocket from 'logrocket'
//LogRocket.init('v3fwnz/rilievomisure')

Vue.filter('number', number)
Vue.filter('dmy', dmy)
Vue.filter('time', time)
Vue.filter('truncate', truncate)

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
  defineCustomElements(window)
  return app.store.dispatch('auth/persistentUser', {}, {root: true})
}
