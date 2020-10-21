
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato } from '@/store/articoloModel'

export const state = () => ({
    // Rilievo vero e proprio
    record: new RilievoRecord(),
    // Dati a supporto
    ui: new RilievoUI()
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
}

export const mutations: MutationTree<RootState> = {

    setRecord: (s, rec: RilievoRecord) => {
        s.record = rec
    },

    setID: (s, res: any) => {
        s.record._id = res.id
        s.record._rev = res.rev
    },

    clearUI: (s) => {
        s.ui = new RilievoUI()
    },

    setArticoloDG: (s, art: ArticoloGeneraleConfigurato) => {
        if (!s.record.listaArticoliGen) {
            s.record.listaArticoliGen = new Array<ArticoloGeneraleConfigurato>()
            s.record.listaArticoliGen.push(art)
        } else {
            // Cerca se già esiste l'articolo in quanto è stato modificato
            const indice = s.record.listaArticoliGen.findIndex(a => a._id === art._id)
            if (indice > -1) {
                s.record.listaArticoliGen.splice(indice, 1, art)
            } else {
                s.record.listaArticoliGen.push(art)
            }
        }
    }
}

export const actions: ActionTree<RootState, RootState> = {

    // Carica il rilievo da DB
    loadByID: async ({ commit, dispatch, state }, id: string) => {
        console.log(id)
        const rec = await dispatch('db/selectById', { table: state.ui.table, id }, { root: true })
        commit('setRecord', rec)
        commit('clearUI')
    },

    reload: async ({ commit, dispatch, state }) => {
        const rec = await dispatch('db/selectById', { table: state.ui.table, id: state.record._id }, { root: true })
        commit('setRecord', rec)
    },

    salva: async ({ commit, dispatch, state }) => {
        let res
        let action: string
        if (state.record._id) {
            action = 'db/update'
        } else {
            action = 'db/insertInto'
        }
        res = await dispatch(action, { table: state.ui.table, data: state.record }, { root: true })
        commit('setID', res)
        await dispatch('reload')
        return res
    },
    
    deleteArtGen: async ({ commit, dispatch, state }, id: string) => {
        state.record.listaArticoliGen.splice(state.record.listaArticoliGen.findIndex(art => art._id == id), 1)
        await dispatch('salva')
    },

    deleteArtSpec: async({ commit, dispatch, state }, id: string) =>{
        let index = state.record.listaArticoliSpec.findIndex(art => art._id == id)
        state.record.listaArticoliSpec.splice(index , 1)
        await dispatch('salva')
    }

}
export class RilievoUI {
    visualizzaWizardSchede = false as boolean
    visualizzaWizardPosizione = false as boolean
    visualizzaWizardRilievo = false as boolean
    readonly table: string = 'rilievi'
}
export class RilievoRecord {
    _id: string  = ''
    _rev: string  = ''

    // TESTATA
    lavoroID: string | null = null
    descrizione: string | null = null
    note: string | null = null
    dataConsegna: Date | null = null
    tipo: number = 0
    dataCreazione: Date | null = null
    utente = null as string | null

    // Dati generali <lista articoli configurati>
    listaArticoliGen = new Array<ArticoloGeneraleConfigurato>(new ArticoloGeneraleConfigurato())

    // Dati specifici <lista articoli configurati>
    listaArticoliSpec = new Array<ArticoloSpecificoConfigurato>(new ArticoloSpecificoConfigurato())
}

// import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
// import { ArticoloGeneraleConfigurato, ArticoloSpecificoConfigurato } from '@/store/articoloModel'

// @Module({ name: 'rilievoModule', stateFactory: true })
// export default class RilievoModule extends VuexModule {

//     // Rilievo vero e proprio
//     record = new RilievoRecord()
//     // Dati a supporto
//     ui = new RilievoUI()
//     @Mutation
//     setRecord(rec: RilievoRecord) {
//         this.record = rec
//     }

//     @Mutation
//     setID(res: any) {
//         this.record._id = res.id
//         this.record._rev = res.rev
//     }

//     @Mutation
//     setArticoloDG(art: ArticoloGeneraleConfigurato) {
//         if (!this.record.listaArticoliGen) {
//             this.record.listaArticoliGen = new Array<ArticoloGeneraleConfigurato>()
//             this.record.listaArticoliGen.push(art)
//         } else {
//             // Cerca se già esiste l'articolo in quanto è stato modificato
//             const indice = this.record.listaArticoliGen.findIndex(a => a._id === art._id)
//             if (indice > -1) {
//                 this.record.listaArticoliGen.splice(indice, 1, art)
//             } else {
//                 this.record.listaArticoliGen.push(art)
//             }
//         }
//     }



//     // Carica il rilievo da DB
//     @Action({ commit: 'setRecord', rawError: true })
//     async loadByID(id: string) {
//         console.log(id)
//         const rec = await this.context.dispatch('db/selectById', { table: this.ui.table, id }, { root: true })
//         return rec
//     }

//     @Action({ commit: 'setID', rawError: true })
//     async salva() {
//         let res
//         let action: string
//         if (this.record._id) {
//             action = 'db/insertInto'
//         } else {
//             action = 'db/update'
//         }
//         res = await this.context.dispatch(action, { table: this.ui.table, data: this.record }, { root: true })
//         console.log(res)
//         return res
//     }

// }






  // @Action
    // async getArticoli_x_DatiGenerali(): Promise<JSArticolo[]> {

    //     let listaResutl = new Array<JSArticolo>()

    //     // Legge tutti gli articoli da DB
    //     let lista = await this.context.dispatch('db/selectAll', { table: 'cataloghi' }, { root: true })
    //     console.log(lista)
    //     // Per ogni articolo


    //     return listaResutl
    // }

    // get getArticoli_Configurati() {
    //     return this.wheels / 2
    // }

    // @Mutation
    // incrWheels(extra: number) {
    //     this.wheels += extra
    // }



