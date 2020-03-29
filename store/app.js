export const state = () => ({
  errors: [],
  menuItems: [
    { icon: 'mdi-home', title: 'Home', to: '/'  },
    { icon: 'mdi-folder-edit', title: 'Gestione lavori', to: '/gestione_lavori'  } // , { icon: 'mdi-monitor-eye', title: 'monitor', to: '/monitor'  },
  ],
  dark: true,
  title: 'Rilievo Misure'
})

export const mutations = {
  setError (state, payload) {
    state.errors.push(payload)
  }
}

export const actions = {
}

export const getters = {
}
