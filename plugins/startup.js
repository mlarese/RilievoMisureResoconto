import Vue from 'vue'
import Notifications from 'vue-notification'
import itMessages from 'devextreme/localization/messages/it';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
// import { DxDataGrid, DxColumn, DxEditing, DxFilterRow, DxPaging, DxScrolling } from 'devextreme-vue/data-grid'
import { DxButton, DxButtonGroup } from 'devextreme-vue'
import BottomNavigation from '../layouts/BottomNavigation'
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {dmy, time, truncate,number} from '../assets/filters'

import VueTouch from 'vue-touch';
Vue.use(VueTouch);

// import themes from "devextreme/ui/themes"; 
// themes.current("material.blue-light");

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


function is_touch_device4() {
    
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  
  var mq = function (query) {
      return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}