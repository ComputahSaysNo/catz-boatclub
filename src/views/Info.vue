<template>
    <div class="info mt-5 mx-2">
            <div class="post-container" v-if="currentPage">
                <h1 class="post-title">{{currentPage.title}}</h1>
                <hr class="rule">
                <div class="post-content" v-html="currentPage.html"></div>
            </div>
        </div>
</template>

<script>
    import db from "../firebase/firebaseInit";

    export default {
        name: "Info",
        data() {
            return {
                currentPage: null
            }
        },
        methods: {
            async getPage() {
                this.$store.state.pageLoaded = false
                if (!this.$route.params.infoId) {this.$router.push('/info/main')}
                const record = await db.collection('info-pages').doc(this.$route.params.infoId)
                const foo = await record.get()
                this.currentPage = foo.data()
                this.$store.state.pageLoaded = true
            }
        },
        async mounted() {
            await this.getPage()
        },
        watch: {
            $route() {
                this.getPage()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .post-title {
        font-size: 40px;
    }

    .post-content ::v-deep p {
        margin-bottom: 1em;
    }

    .post-content ::v-deep td {
        padding: 0.5em;
    }

    .post-content ::v-deep ul {
        list-style: inside;
    }

    .post-content ::v-deep li {
        font-size: 18px;
        margin-bottom: 1em;
    }

    .post-content {
        margin-left: auto;
        margin-right: auto;
    }

    .post-container {
        margin-left: auto;
        margin-right: auto;
        max-width: 1100px;
        p {
            margin-bottom: 1em;
        }
    }

    .rule {
        border-top: 1px solid black;
        width: 100%;
        margin: 10px auto 20px auto
    }
</style>