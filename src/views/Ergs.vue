<template>
    <section class="container mt-5">
        <h1 class="title is-2 mb-1">Land Training</h1>
        <p class="is-italic">Edit the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1ReoQpSWuDcsPaN-56A23IlbNMLRbGBSM7IJbDMsKkvk/edit?usp=sharing">here</a></p>
        <hr class="rule">
        <div class="card p-5 m-3">

            <iframe class="sheet" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ41R87SKK2U4Tx4wB0SDVRhezIgFP-JoBDJmbiZ9jeFBTyTHEQp6wTlIGc50KGW31VfyoVkVkqxFBN/pubhtml?widget=true&amp;headers=false"></iframe>
        </div>

    </section>
</template>

<script>
    export default {
        name: "Ergs"
    }
</script>

<style scoped lang="scss">
.sheet {
    width: 100%;
    height: 800px;
    ::v-deep .name {
        font-size: 100px;}
}
</style>
