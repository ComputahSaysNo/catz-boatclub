<template>
    <div class="edit-post mt-5 mx-2">
        <div class="container">
            <h1 class="title">Edit Post</h1>
            <div class="mb-3 info is-block-mobile is-flex-desktop">
                <b-field style="width: 100%; max-width: 400px" class="mr-3 post-title">
                    <b-input placeholder="Title" v-model="postTitle"></b-input>
                </b-field>
                <b-field class="post-tags">
                    <b-taginput
                            icon="label"
                            placeholder="Tag a crew!"
                            autocomplete
                            :data="filteredTags"
                            @typing="getFilteredTags"
                            field="name"
                            attached
                            v-model="taggedCrews"
                            type="is-warning"
                    >
                    </b-taginput>

                </b-field>
            </div>
            <div class="editor mb-5">
                <vue-editor :editorOptions="editorSettings" @image-added="imageHandler" useCustomImageHandler
                            v-model="postHTML"/>
            </div>
            <div class="actions my-4">
                <b-button @click="uploadPost" type="is-info">Update post</b-button>
            </div>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase/app'
    import 'firebase/storage'
    import db from '../firebase/firebaseInit'
    import {Quill} from 'vue2-editor'

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
                filteredTags: this.$store.state.loadedCrewCards,
                taggedCrews: this.$store.state.editor.taggedCrews,
            }
        },
        methods: {
            getFilteredTags(text) {
                this.filteredTags = this.$store.state.loadedCrewCards.filter((crew)=> {
                    return crew.name.toLowerCase().includes(text)
                })
            },
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
                        resetUploader();
                    }
                )
            },
            async uploadPost() {
                if (this.postTitle.length !== 0 && this.postHTML.length !== 0) {
                    this.taggedCrews.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                    let crewIds = []
                    for (let crew of this.taggedCrews) {
                        crewIds.push(crew.crewId)
                    }
                    const record = await db.collection('posts').doc(this.$route.params.postId)
                    await record.update({
                        html: this.postHTML,
                        title: this.postTitle,
                        author: this.$store.state.authUser.uid,
                        crews: crewIds
                    })
                    await this.$store.dispatch("getNewsCards");
                    this.$store.state.editor = {
                        postHTML: '',
                        postTitle: '',
                        taggedCrews: [],
                    }
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

            p {
                margin-bottom: 0.5em;
                font-size: 18px;
                line-height: 30px;
            }

            img {
                display: block;
                margin: 0 auto;
            }
        }

    }
</style>
