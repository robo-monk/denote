<script>
	import { Service } from './Service.class';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let service = new Service({});
	export let expanded = false;
	export let showPwd = false;
	let pwdInput;

	export let edit;
    export let readonly;
    export let loading;
    $: {
        readonly = !edit;
        loading = service.loading;
    }

	function deleteService() {
		console.log('deleting...', service);
		dispatch('delete', service);
	}

	function save() {
		dispatch('save', service);
		console.log('saving service...', service);
	}

</script>

<div class="service-wrapper bordered {expanded ? 'expanded' : ''} { loading ? 'loading' : '' }">
	<input
		type="text"
		placeholder="Name"
		class="h2"
		bind:value={service.name}
        {readonly}
	/>
	<input
		type="text"
		placeholder="Username"
		class="h5"
		bind:value={service.username}
        {readonly}
	/>

	{#if !edit}
		<div class='button fit p-0' on:click={() => (expanded = !expanded)}>
			{expanded ? 'hide details' : 'show details'}
		</div>
	{/if}

	{#if expanded || edit}
		<!-- <div> -->
			<div class="flex space-between">
			    <!-- <span> Password: </span>  -->
				<input
					type="password"
                    style="width: 100%; margin-right: 10px;"
					placeholder="Password"
					bind:value={service.password}
					bind:this={pwdInput}
                    {readonly}
				/>
				<span
					class="button"
					on:click={() => {
						showPwd = !showPwd;
						pwdInput.type = showPwd ? 'text' : 'password';
					}}
				>
					{showPwd ? 'hide' : 'show'}
				</span>
			</div>
            <div class='flex stretch w-100' style='margin: 15px 0;'>
			    <textarea class='w-100' placeholder="Notes" bind:value={service.details} {readonly}/>
            </div>

			<div class="flex space-between">
			    <span> UUID: </span> 
                <span class='uuid'> { service.uuid } </span>
            </div>


            <div class='flex space-between' style="margin-bottom: 25px;margin-top: 5px;">
			    <span> Stored at: </span> 
                <a
					href={`https://ipfs.io/ipfs/${service?.cid}`}
					target="_blank"
				>
					IPFS
				</a>

			</div>

			<button class="main" on:click={save}> Save </button>
		<!-- </div> -->
	{/if}
	<!-- <input type="textarea" placeholder="Details"> -->
</div>

<style lang="scss">
	.service-wrapper {
        &.loading {
            border-color: gray !important;
            opacity: .7;
        }
		// border: 2px solid var(--sec);
		margin: 5px 0;
		padding: 20px 35px;
		position: relative;
		max-width: 300px;
		overflow: hidden;

		display: flex;
		justify-content: left;
		align-items: stretch;
		flex-direction: column;

		.x-button {
			position: absolute;
			padding: 10px;
			top: 0;
			right: 0;
		}

		#details {
			display: none;

			margin-top: 10px;
			flex-direction: column;
		}

		&.expanded {
			#details {
				display: flex;
			}
		}
	}

    .uuid {
        font-size: 12px;
    }
</style>
