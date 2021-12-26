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
	import { Account } from './lib/Account.class.js';

	window.web3 = Object.assign(window.web3 || {}, { storage: _web3Sstorage });

	export let state = local.get('state') || {};

	export let services = state?.services?.map(s => Service.fromObj(s)) || [];
	async function getAllServices(account) {
		return await web3.storage.list(
			async (i) => {
				if (services.find(s => s.cid == i.cid)) return;
				let service = await web3.storage.get(i.cid);
				services = [...services, new Service({
					...service, cid: i.cid
				})];
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
		if (services?.some(s => s.name == service.name)) {
			prompt(`A service named ${service.name} is already in your account!`)
		}

		let filename = safeJoin(service.uuid, account.name, account.sign(service.uuid))
		let cid = await web3.storage.put(service, filename);
		return cid
	}

	async function deleteService(e) {
		let service = e.detail
		console.log('deleting service....', service)
		if (!account) throw new Error("no account")

		// if (!account.services?.some(s => service.cid == s.cid)) {
		// 	alert("error deleting service")
		// }

		services = [ ...services.filter(s => s.cid != service.cid) ]
		console.log(services)
		await web3.storage.destroy(service.cid);
	}

	// console.log(web3.storage)

	export let account = Account.fromObj(false && state?.account || {
		name: "robomonk",
		sk: "0x0850qjasdf092r9834ofa9df",
		pk: "0x0948520-853092842-204849"
	})

	getAllServices(account)

	window.storeService = async (obj) => {
		console.log('services', services);
		storeService(new Service({
			...obj
		}), account)
	}
	// window.getServices = async () => {
	// 	let s = await getAllServices(account);
	// 	console.log(s)
	// }

	function createService(e) {
		let service = e.detail;
		console.log('service', service);
		storeService(service, account);
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

	<ServiceComponent edit=true on:save={createService}/>

	{#each services as service}
		<ServiceComponent {service} on:delete={deleteService}/>
	{/each}
</main>

<style global lang="scss">
	:root {
		--main: whitesmoke;
		--sec: gray;
		--bg: #181818;
	}

	.mono-font {
		font-family: 'Anonymous Pro', monospace;
	}

	html {
		@extend .mono-font;
		color: var(--main);
		background-color: var(--bg);

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

		button, .button {
			cursor: pointer;
			user-select: none;
			background: transparent;
			border: 0;
			padding: 5px 10px;

			&.main {
				background-color: var(--sec);
			}
		}

		input, textarea {
			background: transparent;
			border: 0;
			padding: 5px 10px;
			margin: 10px;

			&.h2 {
				font-size: 22px;
			}
		}
	}
</style>
