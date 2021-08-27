<template>
    <div class="create-post mt-5 mx-2">
        <div class="container">
            <h1 class="title">Create News Post</h1>
            <div class="editor-info mb-5">
                <b-field>
                    <b-input placeholder="Title" v-model="postTitle"></b-input>
                </b-field>
            </div>
            <div class="editor mb-5">
                <vue-editor :editorOptions="editorSettings" v-model="postHTML" useCustomImageHandler
                            @image-added="imageHandler" @image-removed="imageDeleteHandler"/>
            </div>
            <div class="actions mb-4">
                <b-button type="is-primary" class="mr-3">Preview</b-button>
                <b-button type="is-info" @click="uploadPost">Upload post!</b-button>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase/app'
    import 'firebase/storage'
    import db from '../firebase/firebaseInit'
    import { Quill } from 'vue2-editor'

    import ImageResize from 'quill-image-resize-vue';

    Quill.register("modules/imageResize", ImageResize);

    export default {
        name: "CreatePost",
        data() {
            return {
                editorSettings: {
                    modules: {
                        imageResize: {}
                    }
                },
                imageUrls: []

            }
        },
        methods: {
            imageHandler(file, Editor, cursorLocation, resetUploader) {
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`photos/${file.name}`)
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
                        this.imageUrls.push(downloadURL)
                        resetUploader();
                    }
                )
            },
            imageDeleteHandler(image) {
                let index = this.imageUrls.indexOf(image)
                if (index !== -1) {
                    this.imageUrls.splice(index, 1)
                }
            },
            async uploadPost() {
                if (this.postTitle.length !== 0 && this.postHTML.length !== 0) {
                    const timestamp = Date.now()
                    const record = await db.collection('posts').doc()
                    let coverImgUrl
                    if (this.imageUrls.length !== 0) {
                        coverImgUrl = this.imageUrls[0]
                    } else {
                        coverImgUrl = 'https://firebasestorage.googleapis.com/v0/b/catz-boatclub.appspot.com/o/defaultCover.png?alt=media&token=0a99b835-45f2-435e-a439-657317f3a581'
                    }
                    await record.set({
                        postId: record.id,
                        html: this.postHTML,
                        history: [this.postHTML],
                        coverImgUrl: coverImgUrl,
                        title: this.postTitle,
                        author: this.$store.state.authUser.uid,
                        lastEdit: this.$store.state.authUser.uid,
                        date: timestamp
                    })
                    await this.$store.dispatch("getCards");
                    await this.$router.push({name: "ViewPost", params: {postId: record.id}});
                } else {
                    this.$buefy.dialog.alert({
                        message: 'Post title or body not filled in!',
                        type: 'is-danger',
                    })
                }
            }
        },
        computed: {
            postTitle: {
                get() {
                    return this.$store.state.editor.postTitle;
                },
                set(payload) {
                    this.$store.commit("updatePostTitle", payload);
                },
            },
            postHTML: {
                get() {
                    return this.$store.state.editor.postHTML;
                },
                set(payload) {
                    this.$store.commit("updatePostHTML", payload);
                },
            },
        }
    }
</script>

<style lang="scss">
    .create-post {
        position: relative;
        height: 100%;
    }

    .editor-info {
        width: 500px;
        max-width: 100%;
    }

    .editor {
        height: 55vh;
        display: flex;
        flex-direction: column;

    .quillWrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: white;

    }

    .ql-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: scroll;
        background-color: white;
    }

    .ql-editor {
        padding: 20px 16px 30px;
        background-color: white;
    }

    }
</style>