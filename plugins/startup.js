import Vue from 'vue'
import Notifications from 'vue-notification'
import itMessages from 'devextreme/localization/messages/it';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';

locale('it')
loadMessages(itMessages)

Vue.use(Notifications)

export default async ({ app }) => {
  return await app.store.dispatch('auth/persistentUser', {}, {root: true})
}
