<template>
    <div class="news mt-5 mx-2">
        <div class="container">
            <div class="is-block-mobile is-flex-desktop">
                <h1 class="title is-2 mb-4" ref="title">All News</h1>
                <div class="right ml-auto is-flex">
                    <b-button icon-right="pencil" class="new-post" type="is-info" v-if="$store.state.isAdmin" @click="$router.push({name: 'CreatePost'})">New Post</b-button>
                    <b-input icon-right="magnify" class="search" placeholder="search..." v-model="searchQuery" @input="search"></b-input>
                </div>
            </div>
            <hr class="rule">
            <div class="content-card-wrap">
                <div class="container">
                    <div class="content-cards">
                        <NewsCard :key="index" :post="post"
                                  v-for="(post, index) in displayedCards"></NewsCard>
                    </div>
                    <div class="content-cards" v-if="!$store.state.postsLoaded">
                        <NewsCard v-for="n in 20" :post="{loading: true}" :key="n"></NewsCard>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import NewsCard from "../components/NewsCard";


    export default {
        name: "News",
        components: {
            NewsCard,
        },
        methods: {
            search() {
                this.displayedCards = this.$store.state.loadedNewsCards.filter(card => {return card.title.toLowerCase().includes(this.searchQuery.toLowerCase())})
            }
        },
        mounted() {
            this.$store.dispatch('getNewsCards')
            this.displayedCards = this.$store.state.loadedNewsCards
        },
        data() {
            return {
                displayedCards: [],
                searchQuery: "",
            }
        }
    }
</script>

<style scoped>
    .new-post {
        margin-right: 15px;
    }

    .search {
        width: 300px;
    }
</style>
