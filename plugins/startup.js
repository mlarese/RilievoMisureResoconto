import Vue from 'vue'
import Notifications from 'vue-notification'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {dmy, time, truncate,number} from '../assets/filters'
import PortalVue from 'portal-vue'

// var VueScrollTo = require('vue-scrollto');
// Vue.use(VueScrollTo)

// import Lightbox from 'vue-easy-lightbox'
// Vue.use(Lightbox)

Vue.use(PortalVue)
// import VueTouch from 'vue-touch';
// Vue.use(VueTouch);

// import Vue2TouchEvents from 'vue2-touch-events'
// Vue.use(Vue2TouchEvents)

// import themes from "devextreme/ui/themes";
// themes.current("material.blue-light");

// import LogRocket from 'logrocket'
//LogRocket.init('v3fwnz/rilievomisure')

Vue.filter('number', number)
Vue.filter('dmy', dmy)
Vue.filter('time', time)
Vue.filter('truncate', truncate)

// locale('it')
// loadMessages(itMessages)
Vue.use(Notifications)
// Vue.component('DxDataGrid', DxDataGrid)
// Vue.component('DxColumn', DxColumn)
// Vue.component('DxEditing', DxEditing)
// Vue.component('DxFilterRow', DxFilterRow)
// Vue.component('DxPaging', DxPaging)
// Vue.component('DxScrolling', DxScrolling)
// Vue.component('DxButton', DxButton)
// Vue.component('DxButtonGroup', DxButtonGroup)
// Vue.component('BottomNavigation', BottomNavigation)
// Vue.component('ClassificazioneFactory', ClassificazioneFactory)
// Vue.component('ClassificazioneCombo', ClassificazioneCombo)
// Vue.component('ClassificazioneInput', ClassificazioneInput)

export default async ({ app }) => {
  defineCustomElements(window)
  return app.store.dispatch('auth/persistentUser', {}, {root: true}).then(() => {
    return app.store.dispatch('classificazione/load', {}, {root: true})
  })
}
