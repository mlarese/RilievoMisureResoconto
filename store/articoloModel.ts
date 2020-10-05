
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




class JSModelloART {
    JSModCodice: string = ''
    JSModDesc: string = ''
    JSModMacroCmd: string = ''
    JSModPIM: string = ''
}

class JSRisorsa { }

export class ArticoloGeneraleConfigurato {
    _id: string | null = null
    azienda: string = ''
    catalogo: string = ''
    codice: string = ''
    descrizione: string = ''
    subDescrizione: string = ''
    listaPropValued: Array<PropertyValued> = new Array<PropertyValued>()
}

export class ArticoloSpecificoConfigurato {
    _id: string | null = null
    rifPosID: string | null = null
    rifSchedaID: string | null = null
    listaPropValued: Array<PropertyValued> = new Array<PropertyValued>()
    drawingCommands : string = ''
}


export class PropertyValued {
    propName: string = ''
    propLabel: string = ''
    propValue: string = ''
    propValueDecode: string = ''
    propTableName: string = ''
    isRequired: boolean = false
    propPage: string = ''
    propOrder: string = ''
}

export class JSTableRow {
    JSTabParametri: string = ''
    JSTabRowCodice: string = ''
    JSTabRowColore: string = ''
    JSTabRowDesc: string = ''
    JSTabRowSistAp: string = ''
}