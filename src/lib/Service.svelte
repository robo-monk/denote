<script>
    import { Service } from "./Service.class";
    export let service = new Service(); 
</script>

<div class='service-wrapper'>
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

