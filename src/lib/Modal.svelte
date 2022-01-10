<script context="module">
	let onTop   //keeping track of which open modal is on top
	const modals={}  //all modals get registered here for easy future access
    const animationTime = 200; // animatin time in ms
	
	// 	returns an object for the modal specified by `id`, which contains the API functions (`open` and `close` )
	export function getModal(id=''){
		return modals[id]
	}
    export function openModal(id='') {
        return getModal(id)?.open();
    }
    export function closeModal(id='') {
        return getModal(id)?.close();
    }

</script>

<script>
    import {onDestroy} from 'svelte'
        
    let topDiv
    export let visible=false
    export let opacity=false
    let prevOnTop
    let closeCallback

    export let id=''

    function keyPress(ev){
        //only respond if the current modal is the top one
        if(ev.key=="Escape" && onTop==topDiv) close() //ESC
    }

    /**  API **/
    function open(callback){
        closeCallback=callback
        if(visible) return
        prevOnTop=onTop
        onTop=topDiv
        window.addEventListener("keydown",keyPress)
        
        //this prevents scrolling of the main window on larger screens
        document.body.style.overflow="hidden" 

        visible=true
        opacity = true
    }
        
    function close(retVal){
        if(!visible) return
        window.removeEventListener("keydown",keyPress)
        onTop=prevOnTop
        if(onTop==null) document.body.style.overflow=""

        opacity = false
        setTimeout(() => {
            visible=false
            console.log('close callback', closeCallback)
            if(closeCallback) closeCallback(retVal)
        }, animationTime)
    }
        
    //expose the API
    modals[id]={open,close}
        
    onDestroy(()=>{
        delete modals[id]
        window.removeEventListener("keydown",keyPress)
    })
	
</script>

<div class="modal" class:visible class:opacity bind:this={topDiv} on:click={()=>close()}>
	<div on:click|stopPropagation={()=>{}}>
        <button class='close' on:click={close}>
            ×
        </button>
		<div class='modal-content'>
			<slot/>
		</div>
	</div>
</div>



<style lang='scss'>
    .modal {

        &.visible {
            visibility: visible;
        }

        &.opacity {
            opacity: 1;
        }

        visibility: hidden;
        opacity: 0;

        transition: opacity .2s ease;
        background-color: #000000cc;
        backdrop-filter: blur(5px);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99999;

        display: flex;
        justify-content: center;
        align-items: center;

        .close {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 42px;
        }

        .modal-content {
            position: relative;
            width: 40vw;
            min-width: min(700px, 94vw);
            height: 80vh;
            max-width: min(1000px, 94vw);

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
