<template>
    <div class="view-post my-4 mx-1" v-if="currentPost">
        <div class="post-container">
            <div class="above is-flex" v-if="!$store.state.mobile">
                <div class="left">
                    <h1 class="title is-3 mb-1">{{currentPost.title}}</h1>
                    <h4 class="is-italic ml-1">{{ new Date(this.currentPost.date).toLocaleString("en-gb", { dateStyle: "long" }) }}</h4>
                </div>
                <div class="right is-flex ml-auto" v-if="$store.state.isAdmin">
                    <b-button class="mt-auto mr-2" icon-right="pencil" type="is-info" @click="editPost">Edit</b-button>
                    <b-button class="mt-auto" icon-right="trash-can-outline" type="is-danger" @click="deletePost">Delete</b-button>
                </div>
            </div>
            <div v-else>
                <h1 class="title is-3 mb-1">{{currentPost.title}}</h1>
                <h4 class="is-italic ml-1">{{ new Date(this.currentPost.date).toLocaleString("en-gb", { dateStyle: "long" }) }}</h4>
                <div class="mt-3" v-if="$store.state.isAdmin">
                    <b-button class="mt-auto mr-2" icon-right="pencil" type="is-info" @click="editPost">Edit</b-button>
                    <b-button class="mt-auto" icon-right="trash-can-outline" type="is-danger" @click="deletePost">Delete</b-button>
                </div>
            </div>

            <hr class="rule">

            <div class="card post-content">
                <div class="card-content" v-html="currentPost.html">
                </div>
            </div>

            <div class="crews my-4 p-2 content-card-wrap" v-if="currentPost.crews">
                <h3 class="title is-6" v-if="currentPost.crews.length !== 0">Crews Involved: </h3>
                <div class="content-cards">
                    <CrewCard v-for="(crew, index) in crews" :key="index" :crew="crew"></CrewCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit'
import CrewCard from "../components/CrewCard";

    export default {
        name: "ViewPost",
        components: {CrewCard},
        data() {
            return {
                currentPost: null,
                crews: []
            }
        },
        async mounted() {
            this.$store.state.pageLoaded = false
            const record = await db.collection('posts').doc(this.$route.params.postId)
            const foo = await record.get()
            this.currentPost = foo.data()
            await this.getCrews()
            this.$store.state.pageLoaded = true
        },
        methods: {
            editPost() {
                this.$store.state.editor = {
                    postTitle: this.currentPost.title,
                    postHTML: this.currentPost.html,
                    taggedCrews: this.crews
                }
                this.$router.push({name: 'EditPost', params: {postId: this.$route.params.postId}})
            },
            async deletePost() {
                this.$buefy.dialog.confirm({
                    message: 'Are you sure you want to delete this post? This cannot be undone',
                    confirmText: 'Delete post',
                    type: 'is-danger',
                    onConfirm: async ()=> {
                        await db.collection('posts').doc(this.currentPost.postId).delete()
                        this.$store.commit('resetNewsCards')
                        await this.$router.push({name: 'Home'})
                        this.$buefy.toast.open({message: 'Post deleted', type: 'is-info', position: 'is-bottom'})
                    }
                })
            },
            async getCrews() {
                if (!this.currentPost.crews) {return}
                for (let crewId of this.currentPost.crews) {
                    const record = await db.collection('crews').doc(crewId.toString())
                    const result = await record.get()
                    this.crews.push(result.data())
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .post-title {
        font-size: 30px;
    }


    .post-content {
        margin: 0 auto;
        ::v-deep p {
            margin-bottom: 0.5em;
            font-size: 18px;
            line-height: 30px;
        }
        ::v-deep h2 {
            font-size: 20px;
        }
        ::v-deep h1 {
            font-size: 25px;
        }
        ::v-deep img {
            display: block;
            margin: 0 auto;
        }
        ::v-deep td {
            padding: 0.5em;
        }
        ::v-deep iframe {
            height: 500px;
            width: 100%;
            max-width: 800px;
            max-height: 60vw;
            display: block;
            margin: 0 auto;
        }
        ::v-deep .ql-align-center {
            text-align: center;
        }
        ::v-deep blockquote {
            border-left: 2px solid gray;
            padding-left: 10px;
            font-weight: lighter;
            font-size: 17px;
        }
        ::v-deep a {
            color: #219fff;
            text-decoration: none;
            transition: 0.3s;
            border-bottom: 1px solid transparent;

            &:hover {
                border-color: black;
            }
        }

        ::v-deep ul {
            list-style-type: circle;
        }
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
