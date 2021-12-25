<script>
	// import logo from './assets/svelte.png';
  	// import { put, get } from "./lib/web3.storage.js";
  	// import * as ff from "./lib/local.storage.js";
  	// import * as a from "./lib/encryption.js";
	import ServiceComponent from "./lib/Service.svelte"
	import { Service } from "./lib/Service.class.js"

	export const services = [
		new Service("Twitter", "warzone"),
		new Service("Facebook", "boomer memes"),
		new Service("Github", "microsoft slave"),
	]
</script>

<main>
	<h1>IPM</h1>

	{#each services as service}
		<ServiceComponent service={service}></ServiceComponent>
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
