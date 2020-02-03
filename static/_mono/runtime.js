var GestoreImmagini = {}
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

				let fn = Module.mono_bind_static_method("[ClassLibrary] ClassLibrary.Class1:somma")
				let res = fn(10, 20)

				window.GestoreImmagini.somma = fn;

				console.dir(res)

				let fn2 = Module.mono_bind_static_method("[ClassLibrary] ClassLibrary.Class1:incrementa")
				window.GestoreImmagini.incrementa = fn2;

				fn2(10)
				let res2 = fn2(11)
				console.dir(res2)

				let fn3 = Module.mono_bind_static_method("[TestClassLibrary] TestClassLibrary.Class1:getIMG")
				window.GestoreImmagini.getImmagine = fn3;
				// let res3 = fn3()
				//console.dir(res3)

				// let fn2 = Module.mono_bind_static_method("[ClassLibraryDraw] ClassLibraryDraw.Class1:getIMG")
				// let res2 = fn2()
				// console.dir(res2)

				// let fn3 = Module.mono_bind_static_method("[GestSerNetStandard_DLL] GestSerNetStandard.ICT_GestioneRilievoMisure.DemoMacroComandiRilievoMisure:DoDemoTest2")
				// let res3 = fn3();
				// console.dir(res3)

			}
		)
	},
};