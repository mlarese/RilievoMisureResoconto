
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ArticoloConfigurato } from '@/store/articoloModel'

@Module({ name: 'rilievoModule', stateFactory: true })
export default class RilievoModule extends VuexModule {

    // Rilievo vero e proprio
    record = new RilievoRecord()

    @Mutation
    setRecord(rec: RilievoRecord) {
        this.record = rec
    }

    @Mutation
    setID(id: string) {
        this.record._id = id
    }

    @Mutation
    setArticoloDG(art: ArticoloConfigurato) {
        if (!this.record.listaArticoliGen) {
            this.record.listaArticoliGen = new Array<ArticoloConfigurato>()
            this.record.listaArticoliGen.push(art)
        } else {
            // Cerca se già esiste l'articolo in quanto è stato modificato
            const indice = this.record.listaArticoliGen.findIndex(a => a._id === art._id)
            if (indice > -1) {
                this.record.listaArticoliGen.splice(indice, 1, art)
            } else {
                this.record.listaArticoliGen.push(art)
            }
        }
    }

    // Dati a supporto
    ui = new RilievoUI()

    // Carica il rilievo da DB
    @Action({ commit: 'setRecord', rawError: true })
    async loadByID(id: string) {
        const rec = await this.context.dispatch('db/selectById', { table: this.ui.table, id }, { root: true })
        return rec
    }

    @Action({ commit: 'setID', rawError: true })
    async salva() {
        let res
        let action: string
        if (this.record._id) {
            action = 'db/insertInto'
        } else {
            action = 'db/update'
        }
        res = await this.context.dispatch(action, { table: this.ui.table, data: this.record }, { root: true })
        return res.id
    }

}

export class RilievoUI {
    visualizzaWizardSchede = false as boolean
    readonly table: string = 'rilievi'
}

export class RilievoRecord {
    _id: string | null = null
    _rev: string | null = null

    // TESTATA
    rifLavoroID: string | null = null
    descrizione: string | null = null
    dataConsegna: Date | null = null
    tipo: number = 0
    dataCreazione: Date | null = null
    utente = null as string | null

    // Dati generali <lista articoli configurati>
    listaArticoliGen = [] as ArticoloConfigurato[]

    // Dati specifici <lista articoli configurati>
    listaArticoliSpec = [] as ArticoloConfigurato[]
}





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



