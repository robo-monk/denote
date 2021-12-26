<script>
    import { Service } from "./Service.class";
  	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
    export let service = new Service({}); 
    export let expanded = false;
    export let showPwd = false;
    let pwdInput;

    export let edit = false;


    function deleteService() {
        console.log('deleting...', service)
        dispatch('delete', service);
    }

    function save() {
        dispatch('save', service);
        console.log('saving service...', service)
    }
</script>

<div class='service-wrapper { expanded ? 'expanded' : '' }'>
    {#if !edit}
        <div class='button x-button' on:click={deleteService} > x </div>
        <h2> { service.name } </h2>
        <!-- <span class='uuid'> { service.uuid } </span> -->
        <p> { service.username } </p>

        <div class='button' on:click={ () => expanded = !expanded}> 
            <strong>  
               { expanded ? 'less' : 'more'} 
            </strong>
        </div>

        <div id='details'>
            <span class='uuid'> { service.uuid } </span>
            <!-- <span class='password'> { service.password } </span> -->
            <div>
                <input type="password" placeholder="Password" bind:value={service.password} bind:this={pwdInput}> 
                <span class="button" on:click={ () => {
                        showPwd = !showPwd 
                        pwdInput.type = showPwd ? 'text' : 'password'
                    }
                }> 
                    { showPwd ? 'hide' : 'show' } 
                </span> 
            </div>
            <!-- <span class='uuid'> { service.cid } </span> -->
            <a href="{ `https://ipfs.io/ipfs/${service?.cid}`}" target="_blank"> IPFS </a> 
        </div>
    {:else}
        <input type="text" placeholder="Name" class='h2' bind:value={service.name}>
        <input type="text" placeholder="Username" bind:value={service.username}>
        <div>
            <input type="password" placeholder="Password" bind:value={service.password} bind:this={pwdInput}> 
            <span class="button" on:click={ () => {
                    showPwd = !showPwd 
                    pwdInput.type = showPwd ? 'text' : 'password'
                }
            }> 
                { showPwd ? 'hide' : 'show' } 
            </span> 
        </div>

        <textarea placeholder="Details" bind:value={service.details}></textarea>

        <button class='main' on:click={save}>
            Save
        </button>
        <!-- <input type="textarea" placeholder="Details"> -->
    {/if}
</div>

<style lang="scss">
    .service-wrapper {
        border: 1px solid var(--sec);
        margin: 5px 0;
        padding: 5px 15px;
        position: relative;
        max-width: 400px;
        overflow: hidden;

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
</style>

