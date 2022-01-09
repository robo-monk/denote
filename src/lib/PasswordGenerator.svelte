<script>
    import { getRandomWords } from "./helpers/passwordGenerator"
    export let password;

    function generate() {
        password = getRandomWords();
    }
</script>

<div>
    <div contenteditable=true>{password}</div>
    <button class='main' on:click={generate}> Generate </button>
</div>
