<script>
	// @ts-nocheck
	// import logo from './assets/svelte.png';
	import * as _web3Sstorage from './lib/helpers/web3.storage.js';
	import * as local from './lib/helpers/local.storage.js';
	import { safeJoin, safeSplit } from "./lib/helpers/utilities.js"
	// import * as ff from "./lib/local.storage.js";
	// import * as a from "./lib/encryption.js";
	import ServiceComponent from './lib/Service.svelte';
	import AccountComponent from './lib/Account.svelte';
	import { Service } from './lib/Service.class.js';
	import { Account } from './lib/Account.class.js';
	import Modal, { getModal, openModal, closeModal } from "./lib/Modal.svelte"
	import PasswordGenerator from "./lib/PasswordGenerator.svelte"

	window.web3 = Object.assign(window.web3 || {}, { storage: _web3Sstorage });

	export let state = local.get('state') || {};

	export let services = state?.services?.map(s => Service.fromObj(s)) || [];
	async function getAllServices(account) {
		await web3.storage.list(
			async (i) => {
				if (services.find(s => s.cid == i.cid)) return;
				let newService = new Service({
					...await web3.storage.get(i.cid),
					cid: i.cid,
					loading: true
				});

				if (services.find(s => s.uuid == newService.uuid)) {
					services = services.map(s => s.uuid == newService.uuid ? newService : s);
				} else {
					services = [...services, newService];
				};
			},
			(i) => {
				let [uuid, accountSignature, serviceSignature] = safeSplit(i.name)
				return accountSignature === account.signature 
							&& account.confirm(serviceSignature, uuid)
			}
		);

		services.map(s => s.loading = false)
	}


	async function storeService(service, account) {
		if (!account) return new Error("no account")
		if (services?.some(s => s.name == service.name)) {
			return alert(`A service named ${service.name} is already in your account!`)
		}

		let filename = safeJoin(service.uuid, account.signature, account.sign(service.uuid))
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

		service.loading = true;
		services = services
		await web3.storage.destroy(service.cid);
		services = [ ...services.filter(s => s.cid != service.cid) ]
	}

	// console.log(web3.storage)

	export let account = Account.fromObj(false && state?.account || {
		name: "robomonk",
		sk: "0x0850qjasdf092r9834ofa9df",
		pk: "0x0948520-853092842-204849"
	})

	getAllServices(account)

	async function createService(e) {
		let service = e.detail;
		let storeServicePromise = storeService(service, account);
		service.loading = true;
		services = [service, ...services];
		await storeServicePromise;
		service.loading = false;

		services = services;	
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
	<button class='main' on:click={() => openModal('create-service')}>
		New
	</button>
	<button class='main' on:click={() => openModal('generate-pass')}>
		Make new Password
	</button>



	<Modal id='create-service'>
		<!-- <h1 contenteditable=true> Generate Password </h1> -->
		<!-- <input class='h1' placeholder="Name"> -->
		<ServiceComponent edit={true} on:save={(event) => {
			createService(event); closeModal('create-service')
		}}/>
	</Modal>
	<Modal id='generate-pass'>
		<!-- <h1 contenteditable=true> Generate Password </h1> -->
		<!-- <input class='h1' placeholder="Name"> -->
		<PasswordGenerator/>
		<!-- <ServiceComponent edit={true} on:save={createService}/> -->
	</Modal>




	<div class='flex wrap' style="gap: 10px;">
		{#each services as service}
			<ServiceComponent {service} edit={false} loading={service.loading} on:delete={deleteService}/>
		{/each}
	</div>
</main>

<style global lang="scss">
	:root {
		--main: whitesmoke;
		// --sec: rgb(39, 62, 138);
		--sec: #FF785A;
		--bg: #181818;
	}

	.mono-font {
		font-family: 'Ubuntu Mono', monospace;
	}


	.flex {
		display: flex;
		align-items: center;

		&.wrap {
			flex-wrap: wrap;
		}

		&.stretch {
			align-items: stretch;
			justify-content: stretch;
		}

		&.col {
			flex-direction: column;
		}

		&.flex-start {
			align-items: flex-start;
		}

		&.space-between {
			justify-content: space-between;
		}
	}

	.w {
		&-100 {
			width: 100%;
		}
	}

	.bordered {
		border: 2px solid var(--sec);
		border-radius: 5px;
	}

	body {
		margin: 0;
	}
	html {
		@extend .mono-font;
		color: var(--main);
		background-color: var(--bg);

		* {
			@extend .mono-font;
			color: var(--main);
		}

		$typography: (
			"h1": 50px,
			"h2": 42px,
			"h3": 33px,
			"h4": 26px,
			"h5": 20px,
			"body-1": 16px, 
			"body-2": 14px, 
		);

		@each $type, $size in $typography {
			#{$type}, .#{$type} {
				font-size: $size;
			}
		}


		h1,
		h2,
		h2,
		h3,
		h4,
		h5,
		.h1, .h2, .h3, .h4, .h5
		{
			font-weight: 700;
		}

		button, .button {
			cursor: pointer;
			user-select: none;
			background: transparent;
			border: 0;
			padding: 12px 10px;
			max-width: 100px;
			border-radius: 5px;
			font-weight: 900;
			@extend .default-transition;

			&:hover {
				filter: brightness(1.5);
			}

			&.main {
				background-color: var(--sec);
			}

			&.fit {
				min-width: fit-content;
			}
		}

		.default-transition {
			transition: all .2s ease;
		}
		input, textarea {
			background: transparent;
			border: 2px solid transparent;
			padding: 12px 10px;
			margin: 5px -10px;
			// margin: 10px 0;
			outline: 0;
			@extend .default-transition;
				border-radius: 5px;

			&:hover {
				border: 2px solid rgba(245, 245, 245, 0.2);
			}
			&:focus {
				border: 2px solid rgba(245, 245, 245, 0.6);
			}
		}

		.p-0 {
			padding: 0;
		}
	}
</style>
