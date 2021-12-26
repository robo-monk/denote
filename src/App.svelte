<script>
	// @ts-nocheck
	// import logo from './assets/svelte.png';
  	import * as _web3Sstorage from "./lib/web3.storage.js";
	import * as local from  "./lib/local.storage.js";
  	// import * as ff from "./lib/local.storage.js";
  	// import * as a from "./lib/encryption.js";
	import ServiceComponent from "./lib/Service.svelte"
	import AccountComponent from "./lib/Account.svelte"
	import { Service } from "./lib/Service.class.js"

	window.web3 = Object.assign(window.web3 || {}, { storage: _web3Sstorage});

	export let state = local.get('state') || {};
	(async () => {
		// console.log(await web3.storage.list());
		web3.storage.list(i => {
			console.log(i)
		}, i => i.name.length > 10)
	})()

	export let services = state?.services?.map(s => Service.fromObj(s)) || [
		new Service("Twitter", "warzone"),
		new Service("Facebook", "boomer memes"),
		new Service("Github", "microsoft slaves"),
	];

	$: {
		local.put({
			services
		}, "state");
	}

</script>

<main>
	<h1>IPM</h1>
	<AccountComponent/>
	{#each services as service}
		<ServiceComponent service={service}/>
	{/each}
</main>

<style global lang="scss">

	:root {
		--main: black;
		--sec: gray;
		--bg: whitesmoke;
	}

	.mono-font {
		font-family: 'Anonymous Pro', monospace;
	}

	html {
		@extend .mono-font;
		color: var(--main);
		background-color: whitesmoke;

		* {
			@extend .mono-font;
			color: var(--main);
		}

		h1, h2, h3, h4, h5, h6 {
			font-weight: 700;
		}
	}
</style>
