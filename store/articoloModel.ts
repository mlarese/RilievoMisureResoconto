
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import JSArtProp from '@/models/JSArtProp'

@Module({ name: 'articoloModule', stateFactory: true })
export default class ArticoloModule extends VuexModule {

    public articolo = new JSArticolo()

}

export class JSArticolo {
    JSCodice: string = ''
    JSDescrizione: string = ''
    JSImmagineRisID: string = ''
    JSArticleClass: string = ''
    JSProperties = new Array<JSArtProp>()
    JSModelli = new Array<JSModelloART>()
    JSRisorse = new Array<JSRisorsa>()

    // external
    catalogoCodice: string = ''
}




class JSModelloART { }

class JSRisorsa { }

export class ArticoloConfigurato {
    _id: string | null = null
    catalogo: string = ''
    codice: string = ''
    descrizione: string = ''
    listaPropValued: Array<PropertyValued> = new Array<PropertyValued>()
}


export class PropertyValued {
    propName: string = ''
    propLabel: string = ''
    propValue: string = ''
    propTableName: string = ''
    isRequired: boolean = false
}

export class JSTableRow {
    JSTabParametri: string = ''
    JSTabRowCodice: string = ''
    JSTabRowColore: string = ''
    JSTabRowDesc: string = ''
    JSTabRowSistAp: string = ''
}