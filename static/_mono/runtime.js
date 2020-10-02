var GPROD = {}
const baseDLL = "[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:"

var Module = {
	onRuntimeInitialized: function () {
		MONO.mono_load_runtime_and_bcl(
			config.vfs_prefix,
			config.deploy_prefix,
			config.enable_debugging,
			config.file_list,
			function () {
				// Module.mono_bindings_init("[WebAssembly.Bindings]WebAssembly.Runtime")
				// BINDING.call_static_method("[ClassLibrary] ClassLibrary.Class1:somma", []);
			
				// let fn1 = Module.mono_bind_static_method("[ICT_GestioneSerramenti] ICT_GestioneSerramenti.Tester:getComandiImmagine")
				// window.GestoreImmagini.getDrawingCommands = fn1;

				// let fn4 = Module.mono_bind_static_method("[ICT_GestioneSerramenti] ICT_GestioneSerramenti.Tester:getComandiImmagine")
				// window.GestoreImmagini.getDrawingCommands = fn4;
				

				//Public Shared Sub AddJSCatalogo(JSCatalogoString As String)
				window.GPROD.AddJSCatalogo = Module.mono_bind_static_method(baseDLL + "AddJSCatalogo")

				//Public Shared Function GetListaArticoli_as_JSON() As String
				window.GPROD.GetListaArticoli_as_JSON = Module.mono_bind_static_method(baseDLL + "GetListaArticoli_as_JSON")
				
				// Public Shared Function GetListaModelli_as_JSON(Catalogo As String, ArticoloCodice As String) As String
				window.GPROD.GetListaModelli_as_JSON = Module.mono_bind_static_method(baseDLL + "GetListaModelli_as_JSON")
				
				// Public Shared Sub IstanziaNuovoProdottoDaJSModello(JSModArt_Serialized As String)
				window.GPROD.IstanziaNuovoProdottoDaJSModello = Module.mono_bind_static_method(baseDLL + "IstanziaNuovoProdottoDaJSModello")

				// Public Shared Sub ApplicaMC_x_Modifica(MacroCmd As String)
				window.GPROD.ApplicaMC_x_Modifica = Module.mono_bind_static_method(baseDLL + "ApplicaMC_x_Modifica")

				// Public Shared Function GetPIMSerialized() As String
				window.GPROD.GetPIMSerialized = Module.mono_bind_static_method(baseDLL + "GetPIMSerialized")

				// Public Shared Function getPIMSerialized_con_OggettoSelezionato(selectObject_X As Integer, selectObject_Y As Integer) As String
				window.GPROD.getPIMSerialized_con_OggettoSelezionato = Module.mono_bind_static_method(baseDLL + "getPIMSerialized_con_OggettoSelezionato")

				//   Public Shared Sub SetTables(TablesSerializzato As String)
				window.GPROD.SetTables = Module.mono_bind_static_method(baseDLL + "SetTables")

				// Public Shared Sub SetCatalogoInUso(CatalogoCodice As String)
				window.GPROD.SetCatalogoInUso = Module.mono_bind_static_method(baseDLL + "SetCatalogoInUso")

				// Public Shared Function GetTableSerialized(TableName As String) As String
				window.GPROD.GetTableSerialized = Module.mono_bind_static_method(baseDLL + "GetTableSerialized")

				// Public Shared Function GetTableRow(TabName As String, RowCode As String) As JSTableRow
				window.GPROD.GetTableRow = Module.mono_bind_static_method(baseDLL + "GetTableRow")

				// Public Shared Function GetTableRow_ParValue(TabName As String, RowCode As String, ParName As String) As String
				window.GPROD.GetTableRow_ParValue = Module.mono_bind_static_method(baseDLL + "GetTableRow_ParValue")

				// Public Shared Function SetProperty(propName As String, propVal As String) As String
				window.GPROD.SetProperty = Module.mono_bind_static_method(baseDLL + "SetProperty")

				// Public Shared Function GetPropertyDesc(propName As String, propVal As String) As String
				window.GPROD.GetPropertyDesc = Module.mono_bind_static_method(baseDLL + "GetPropertyDesc")

				// Public Shared Sub ImpostaLuceTelaio_ConLuceVuota()
				window.GPROD.ImpostaLuceTelaio_ConLuceVuota = Module.mono_bind_static_method(baseDLL + "ImpostaLuceTelaio_ConLuceVuota")

				// Public Shared Sub ImpostaLuceTelaio_ConPannello()
				window.GPROD.ImpostaLuceTelaio_ConPannello = Module.mono_bind_static_method(baseDLL + "ImpostaLuceTelaio_ConPannello")

				// Public Shared Sub ImpostaLuceTelaio_ConGrpAnteSTD()
				window.GPROD.ImpostaLuceTelaio_ConGrpAnteSTD = Module.mono_bind_static_method(baseDLL + "ImpostaLuceTelaio_ConGrpAnteSTD")

				// Public Shared Function getMacrocomandi() As String
				window.GPROD.getMacrocomandi = Module.mono_bind_static_method(baseDLL + "getMacrocomandi")

				// Public Shared Function GetLuceTelaioInGestione() As String
				window.GPROD.GetLuceTelaioInGestione = Module.mono_bind_static_method(baseDLL + "GetLuceTelaioInGestione")

				// Public Shared Sub IstanziaProdottoDaMC(macroComandi As String)
				window.GPROD.IstanziaProdottoDaMC = Module.mono_bind_static_method(baseDLL + "IstanziaProdottoDaMC")

				// Public Shared Function GetGruppoAnteInGestione() As String
				window.GPROD.GetGruppoAnteInGestione = Module.mono_bind_static_method(baseDLL + "GetGruppoAnteInGestione")

				// Public Function getGruppoAntePrincID() As String
				window.GPROD.getGruppoAntePrincID = Module.mono_bind_static_method(baseDLL + "getGruppoAntePrincID")



				// let fn3 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:getComandiImmagine")
				// window.GPROD.getDrawingCommands = fn3;

				// let fn4 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:resetStrutturaSerramento")
				// window.GPROD.resetStrutturaSerramento = fn4;

				// let fn5 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:setMacroComandi")
				// window.GPROD.setMacroComandi = fn5;

				// let fn6 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:getMacroComandi")
				// window.GPROD.getMacroComandi = fn6;
				
			}
		)
	},
};