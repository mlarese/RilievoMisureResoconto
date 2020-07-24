import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      storage: window.localStorage,
      reducer: (state) => ({ auth: state.auth, classificazione: state.classificazione }),
    }).plugin(store);
  });
}
