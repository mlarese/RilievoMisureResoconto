var GPROD = {}
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

				let fn1 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:AddJSCatalogo")
				window.GPROD.AddJSCatalogo = fn1;

				let fn2 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:GetListaArticoli_as_JSON")
				window.GPROD.GetListaArticoli = fn2;

				let fn3 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:getComandiImmagine")
				window.GPROD.getDrawingCommands = fn3;

				let fn4 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:resetStrutturaSerramento")
				window.GPROD.resetStrutturaSerramento = fn4;

				let fn5 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:setMacroComandi")
				window.GPROD.setMacroComandi = fn5;

				let fn6 = Module.mono_bind_static_method("[ICT_GestoreSerramenti_STD] ICT_GestoreSerramenti_STD.GestorePWApp:getMacroComandi")
				window.GPROD.getMacroComandi = fn6;
				
			}
		)
	},
};