<template>
<div class="news mt-3 mx-2">
    <div class="container">
        <h1 class="post-title" ref="title">All News</h1> <b-button tag="router-link" to="/create-post">Create new post</b-button>
        <div class="content-card-wrap">
            <div class="container">
                <div class="content-cards">
                    <ContentCard :post="post" v-for="(post, index) in $store.state.loadedCards" :key="index"></ContentCard>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import ContentCard from "../components/ContentCard";


    export default {
        name: "News",
        components: {
            ContentCard,
        },
        methods: {
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .post-title {
        font-size: 40px;
    }
</style>
