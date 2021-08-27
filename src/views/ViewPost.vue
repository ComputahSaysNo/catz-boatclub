<template>
    <div class="view-post p-5" v-if="currentPost">
        <div class="post-container">
            <h1 class="post-title">{{currentPost.title}}</h1>
            <h4 class="is-italic">{{ new Date(this.currentPost.date).toLocaleString("en-gb", { dateStyle: "long" }) }}</h4>
            <hr class="rule">
            <div class="post-content" v-html="currentPost.html"></div>
        </div>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit'

    export default {
        name: "ViewPost",
        data() {
            return {
                currentPost: null,
            }
        },
        async mounted() {
            this.$store.state.pageLoaded = false
            const record = await db.collection('posts').doc(this.$route.params.postId)
            const foo = await record.get()
            this.currentPost = foo.data()
            this.$store.state.pageLoaded = true
        }
    }
</script>

<style scoped lang="scss">
    .post-title {
        font-size: 30px;
    }

    .post-content ::v-deep p {
        margin-bottom: 1em;
    }

    .post-content ::v-deep td {
        padding: 0.5em;
    }

    .post-content {
        margin-left: auto;
        margin-right: auto;
    }

    .post-container {
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }

    .rule {
        border-top: 1px solid black;
        width: 100%;
        margin: 10px auto 20px auto
    }

</style>