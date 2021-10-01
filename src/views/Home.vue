<template>
    <div class="home">
        <section class="hero is-medium has-bg-img">
            <div class="hero-body">
                <div class="container">
                    <div class="title-bg p-4">
                        <h1 class="title is-1 has-text-light">
                            St. Catharine's College Boat Club
                        </h1>
                        <h2 class="subtitle has-text-warning is-uppercase">founded 1883</h2>
                    </div>
                </div>
            </div>
        </section>
        <section class="section has-background-white">
            <div class="container">
                <h1 class="has-text-centered title is-3">Welcome</h1>
                <p class="welcome">We are SCCBC, the Boat Club of St. Catharine's College, Cambridge. Any student,
                    novice
                    or experienced, is welcome to row with us - to find out more,
                    <router-link to="/info/main">click here!</router-link>
                </p>
            </div>
        </section>
        <div class="content-card-wrap">
            <div class="container">
                <h1 class="title is-4">Latest News and Reports:</h1>
                <div class="content-cards" v-if="getCardsPreview">
                    <NewsCard :key="index" :post="post" v-for="(post, index) in this.cardsPreview"></NewsCard>
                </div>
                <div class="content-cards" v-if="!this.$store.state.postsLoaded">
                    <NewsCard v-for="n in numCards" :post="{loading: true}" :key="n"></NewsCard>
                </div>
            </div>
        </div>
        <div class="container e">
            <b-button :to="{name: 'News'}" class="news-link" icon-right="arrow-right" tag="router-link"
                      type="is-danger">view all news
            </b-button>
        </div>
    </div>
</template>

<script>
    import NewsCard from "../components/NewsCard";

    export default {
        data() {
            return {
                cardsPreview: [],
                numCards: Math.min(Math.floor(window.innerWidth / 300), 5)
            }
        },
        methods: {
            getCardsPreview() {
                this.numCards = Math.min(Math.floor(window.innerWidth / 300), 5)
                this.cardsPreview = this.$store.state.loadedNewsCards.slice(0, this.numCards)
            }
        },
        components: {
            NewsCard
        },
        mounted() {
            window.addEventListener("resize", this.getCardsPreview)
            this.$store.dispatch('getNewsCards', 5).then(()=> {
                this.getCardsPreview()
            })

        },

    }
</script>

<style lang="scss" scoped>
    .has-bg-img {
        background: url('../assets/hero.jpg') center center;
        background-size: cover;
    }

    .title-bg {
        background-color: rgba(30, 30, 30, 0.9);
        display: inline-block;
        border-radius: 10px;
    }

    .welcome {
        font-size: 18px;
        text-align: center;
        width: 700px;
        max-width: 100%;
        margin: 0 auto;
    }

    .cards-title {
        font-size: 25px;
        margin-bottom: 15px;
    }

    .news-link {
        width: 260px;
        margin-bottom: 20px;
    }

    .e {
        text-align: center;
    }

</style>
