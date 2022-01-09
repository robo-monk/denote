<script>
    export let show;
</script>



{#if show}
<div class='popup'>
    <div class='popup-content'>
        <button class='close' on:click={() => show=false}>
            ×
        </button>
        <slot/>
    </div>
</div>
{/if}


<style lang='scss'>
    .popup {
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
        .popup-content {
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
