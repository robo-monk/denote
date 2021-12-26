<script>
	// @ts-nocheck
	// import logo from './assets/svelte.png';
	import * as _web3Sstorage from './lib/web3.storage.js';
	import * as local from './lib/local.storage.js';
	import { safeJoin, safeSplit } from "./lib/utilities.js"
	// import * as ff from "./lib/local.storage.js";
	// import * as a from "./lib/encryption.js";
	import ServiceComponent from './lib/Service.svelte';
	import AccountComponent from './lib/Account.svelte';
	import { Service } from './lib/Service.class.js';
	import { v4 as uuidv4 } from 'uuid';
	import { Account } from './lib/Account.class.js';

	window.web3 = Object.assign(window.web3 || {}, { storage: _web3Sstorage });

	export let state = local.get('state') || {};
	(async () => {
		// console.log(await web3.storage.list());
		web3.storage.list(
			(i) => {
				console.log(i);
			},
			(i) => i.name.length > 10
		);
	})();

	async function getAllServices(account) {
		return await web3.storage.list(
			(i) => {
				console.log(i);
			},
			(i) => {
				let [uuid, accountName, signature] = safeSplit(i.name)
				return accountName === account.name 
							&& account.confirm(signature, uuid)
			}
		);
	}
	async function storeService(service, account) {
		if (!account) return new Error("no account")
		if (account.services?.includes(service.name)) {
			prompt(`A service named ${service.name} is already in your account!`)
		}

		let uuid = uuidv4()
		let filename = safeJoin(uuid, account.name, account.sign(uuid))
			// .map((n) => n.replaceAll('.', '[$dot$]'))
			// .join('.');

		let cid = await web3.storage.put(service, filename);
		return cid
	}

	export let services = state?.services?.map(s => Service.fromObj(s)) || [
		new Service("Twitter", "warzone"),
		new Service("Facebook", "boomer memes"),
		new Service("Github", "microsoft slaves"),
	];

	export let account = Account.fromObj(state?.account || {
		name: "robomonk",
		sk: "0x0850qjasdf092r9834ofa9df",
		pk: "0x0948520-853092842-204849"
	})

	window.storeService = () => {
		storeService(services[1], account);
	}

	window.getServices = async () => {
		let s = await getAllServices(account);
		console.log(s)
	}


	$: {
		const state = {
			services,
			account
		}

		local.put(state, "state");
	}
</script>

<main>
	<h1>IPM</h1>
	<AccountComponent {account} />
	{#each services as service}
		<ServiceComponent {service} />
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

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			font-weight: 700;
		}
	}
</style>
