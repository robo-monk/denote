<script>
    import { Service } from "./Service.class";
  	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
    export let service = new Service(); 

    function deleteService() {
        console.log('deleting...', service)
        dispatch('delete', service);
    }
</script>

<div class='service-wrapper'>
    <div class='button' on:click={deleteService} > x </div>
    <h2> { service.name } </h2>
    <p> { service.description } </p>
</div>

<style>
    .service-wrapper {
        border: 1px solid var(--sec);
        margin: 5px 0;
        padding: 5px 15px;
    }
</style>

