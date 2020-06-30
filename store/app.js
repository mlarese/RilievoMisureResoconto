import _filter from 'lodash/filter'

export const state = () => ({
  errors: [],
  messages: [],
  countMessages: 0,
  menuItems: [
    { icon: 'mdi-home', title: 'Home', to: '/', drawer: 'true', tabmenu: 'true'  },
    { icon: 'mdi-folder', title: 'Lavori', to: '/gestione_lavori', drawer: 'true', tabmenu: 'true'  }, // , { icon: 'mdi-monitor-eye', title: 'monitor', to: '/monitor'  },
    { icon: 'mdi-contacts', title: 'Contatti', to: '/gestione_contatti', drawer: 'true', tabmenu: 'false'  }, 
    { icon: 'import_contacts', title: 'Cataloghi', to: '/cataloghi', drawer: 'true', tabmenu: 'true'  },
    { icon: 'mdi-account-group', title: 'Utenti', to: '/gestione_utenti', drawer: 'true', tabmenu: 'false'  },
    { icon: 'mdi-database-sync', title: 'Sincronizzazione', to: '/sincronizzazione', drawer: 'true', tabmenu: 'false'}
  ],
  dark: true,
  title: 'AgileWork'
})

export const mutations = {
  setError (state, payload) {
    state.errors.push(payload)
  },
  setMessage (state, payload) {
    state.messages.push(payload)
  },
  setTitle (state, payload) {
    state.title = payload
  }
}

export const actions = {
}

export const getters = {
  getMenuItems_Drawer: s => _filter(s.menuItems, { 'drawer': 'true' }),
  getMenuItems_Tab: s => _filter(s.menuItems, { 'tabmenu': 'true' })
}
