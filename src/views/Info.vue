<template>
    <div class="info my-5 mx-1">
            <div class="post-container" v-if="currentPage">
                <div class="is-flex">
                    <div class="ml-2">
                        <b-field style="max-width: 70%" v-if="editing && $store.state.isAdmin" grouped>
                            <b-input expanded style="width: 400px;" class="mb-3" size="is-medium" placeholder="Page title" v-model="currentPage.title"></b-input>
                            <b-button v-show="editing" class="mb-4 mt-auto" icon-right="check" type="is-success" @click="updatePage"></b-button>
                        </b-field>
                        <div v-else class="is-flex">
                            <h1 class="title is-3 mb-1">{{currentPage.title}}</h1>
                            <b-button v-if="$store.state.isAdmin" v-show = "!editing" class="mt-auto ml-4" icon-right="pencil" type="is-info" @click="editing=true"></b-button>
                        </div>

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
            height: 600px;
            width: 80%;
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
            font-size: 18px;
            line-height: 2em;
            list-style-type: square;
            list-style-position: outside;
            margin-left: 30px;
        }
    }

    .post-container {
        margin-left: auto;
        margin-right: auto;
        width: 1100px;
        max-width: 100%;
    }

    .rule {
        border-top: 1px solid black;
        width: 100%;
        margin: 10px auto 20px auto
    }

    .editor {
        margin-left: auto;
        margin-right: auto;
        width: 1100px;
        max-width: 100%;
        p {
            margin-bottom: 1em;
        }
        height: 70vh;
    }

</style>
