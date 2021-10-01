<template>
    <div class="info my-5 mx-1">
            <div class="post-container" v-if="currentPage">
                <div class="above is-flex">
                    <div class="left">
                        <b-input style="width: 400px" size="is-medium" placeholder="Page title" v-if="editing" v-model="currentPage.title"></b-input>
                        <h1 v-else class="title is-3 mb-1">{{currentPage.title}}</h1>

                    </div>
                    <div class="right is-flex ml-auto" v-if="$store.state.isAdmin">
                        <b-button v-show = "!editing" class="mt-auto mr-2" icon-right="pencil" type="is-info" @click="editing=true">Edit</b-button>
                        <b-button v-show="editing" class="mt-auto mr-2" icon-right="check" type="is-success" @click="updatePage">Done</b-button>
<!--                        <b-button class="mt-auto" icon-right="trash-can-outline" type="is-danger" @click="deletePage">Delete</b-button>-->
                    </div>
                </div>

                <hr class="rule">
                <div class="post-content card mb-3" v-show="!editing">
                    <div class="card-content" v-html="currentPage.html"></div>
                </div>
                <div class="editor mb-5" v-show="editing">
                    <vue-editor :editorOptions="editorSettings" @image-added="imageHandler" useCustomImageHandler
                                v-model="currentPage.html"/>
                </div>
            </div>
        </div>
</template>

<script>
    import db from "../firebase/firebaseInit";
    import firebase from "firebase/app";

    export default {
        name: "Info",
        data() {
            return {
                currentPage: null,
                editorSettings: {
                    modules: {
                        imageResize: {}
                    }
                },
                editing: false,
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
            },
            async updatePage() {
                this.editing = false
                await db.collection('info-pages').doc(this.$route.params.infoId).update(this.currentPage)
            },
            async deletePage() {

            },
            imageHandler(file, Editor, cursorLocation, resetUploader) {
                const id = Math.random().toString(26).slice(-8)
                const storageRef = firebase.storage().ref();
                const path = `photos/${id}.jpg`
                const fileRef = storageRef.child(path)
                fileRef.put(file).on(
                    "state_changed",
                    (snapshot) => {
                        console.log(snapshot);
                    },
                    (err) => {
                        console.log(err);
                    },
                    async () => {
                        const downloadURL = await fileRef.getDownloadURL();
                        Editor.insertEmbed(cursorLocation, "image", downloadURL);
                        resetUploader();
                    }
                )
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

    .post-content ::v-deep a {
        color: #219fff;
        text-decoration: none;
        transition: 0.3s;
        border-bottom: 1px solid transparent;
        &:hover {
            border-color: black;
        }
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
        margin-left: 50px;
    }

    .post-content ::v-deep img {
        display: block;
        margin: 0 auto;
    }

    .post-content ::v-deep h1 {
        font-size: 25px;
    }

    .post-content ::v-deep h2 {
        font-size: 20px;
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

    .editor {
        margin-left: auto;
        margin-right: auto;
        max-width: 1100px;
        p {
            margin-bottom: 1em;
        }
        height: 70vh;
    }

</style>
