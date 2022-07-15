<template>
    <div class="gallery mt-5 mx-2">
        <div class="container">
            <div class="is-flex">
                <h1 class="title is-2 mb-0" ref="title">Gallery</h1>
                <div class="right ml-auto is-flex">
                    <b-field class="file is-info">
                        <b-upload v-if="$store.state.authUser" accept="image/*" @input="uploadImage" class="file-label" v-model="file">
                            <span class="file-cta">
                                <b-icon class="file-icon" icon="upload"></b-icon>
                                <span class="file-label">Click to upload</span>
                                <b-loading :is-full-page="true" v-model="fileUploadLoading"></b-loading>
                            </span>
                        </b-upload>
                    </b-field>
                </div>
            </div>
            <hr class="rule">
            <div class="card p-3">
                <b-carousel :indicator="false"
                            :indicator-inside="false"
                            :interval="2000"
                            with-carousel-list>
                    <b-carousel-item :key="i" v-for="(image, i) in images">
                        <b-image :src="image.url" class="image" ratio="16by9"></b-image>
                    </b-carousel-item>
                </b-carousel>
            </div>

            <div class="card content-card-wrap-gallery my-6">
                <div class="content-cards">
                    <div :key="index" @click="selectImage(image)" class="thumb card" v-for="(image, index) in images">
                        <div class="card-image">
                            <b-image :src="image.thumbURL" @error="console.log(image.thumbURL)"
                                     @load="image.loading=false" class="cover"
                                     ratio="1by1"></b-image>
                            <b-loading :is-full-page="false" v-model="image.loading"></b-loading>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal v-if="selectedImage" v-model="modalOpen">
            <div class="card m-3">
                <div class="card-image">
                    <b-image :src="selectedImage.url" class="selectedImage"></b-image>
                </div>

                <div class="card-footer px-3 py-1">
                    <b-button @click="$router.push(`news/${selectedImage.post}`)" class="subtitle is-6 my-2 mr-auto"
                              icon-right="arrow-right"
                              type="is-info" v-if="selectedImageData.linkedPost">
                        View post: "{{selectedImageData.linkedPost}}"
                    </b-button>
                    <p v-if="!$store.state.mobile" class="subtitle is-6 my-4 is-italic ml-auto">
                        {{new Date(selectedImage.date).toLocaleString("en-gb", { dateStyle: "long" })}} by
                        {{selectedImageData.uploaderName}}
                    </p>
                </div>
            </div>

        </b-modal>
    </div>
</template>
<script>
    import firebase from 'firebase/app'
    import db from '../firebase/firebaseInit'


    export default {
        name: "Gallery",
        methods: {
            async getImages() {
                // const listRef = await firebase.storage().ref().child('photos/thumbnails')
                // listRef.listAll().then((res) => {
                //     res.items.forEach((itemRef) => {
                //         itemRef.getDownloadURL().then((url)=>this.images.push(url))
                //     })
                // })
                const imageDocs = await db.collection('media').orderBy('date', 'desc').get()
                for (let doc of imageDocs.docs) {
                    const thumbRef = firebase.storage().ref().child(`photos/thumbnails/${doc.id}_200x200.jpg`)
                    const thumbURL = await thumbRef.getDownloadURL().catch(() => {
                    })
                    let data = doc.data()
                    data.thumbURL = thumbURL
                    data.loading = true
                    this.images.push(data)
                }
            },
            async selectImage(image) {
                this.selectedImageData = {
                    uploaderName: '',
                    linkedPost: '',
                }
                this.selectedImage = image
                this.modalOpen = true
                const userDoc = await db.collection('profiles').doc(image.uploadedBy.toString())
                const result = await userDoc.get()
                if (result.exists) {
                    this.selectedImageData.uploaderName = result.data().name
                }


                let result2
                if (image.post) {
                    const postDoc = await db.collection('posts').doc(image.post.toString())
                    result2 = await postDoc.get()
                    if (result2.exists) {
                        this.selectedImageData.linkedPost = result2.data().title
                    }

                }

            },
            async uploadImage() {
                this.fileUploadLoading = true
                const id = Math.random().toString(26).slice(-8)
                const storageRef = firebase.storage().ref();
                const path = `photos/${id}.jpg`
                const fileRef = storageRef.child(path)
                fileRef.put(this.file).on(
                    "state_changed",
                    (snapshot) => {
                        console.log(snapshot);
                    },
                    (err) => {
                        console.log(err);
                    },
                    async () => {
                        const mediaRecord = await db.collection('media').doc(id)
                        const fileRef = firebase.storage().ref().child(`photos/${id}.jpg`);
                        const url = await fileRef.getDownloadURL()
                        let newRecord = {
                            path: `photos/${id}.jpg`,
                            taggedCrews: [],
                            date: Date.now(),
                            post: null,
                            uploadedBy: this.$store.state.authUser.uid,
                            url: url
                        }
                        await mediaRecord.set(newRecord).then(() => {
                            newRecord.thumbURL = url
                            this.fileUploadLoading = false
                            this.$buefy.toast.open({message: 'Image uploaded', type: 'is-info', position: 'is-bottom'})
                            this.images.unshift(newRecord)
                        })
                    }
                )
            }
        },
        data() {
            return {
                images: [],
                loading: true,
                isFullPage: false,
                modalOpen: false,
                selectedImage: null,
                db: db,
                selectedImageData: {
                    uploaderName: '',
                    linkedPost: '',
                },
                file: null,
                fileUploadLoading: false,
            }
        },
        mounted() {
            this.getImages()
        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
    .thumb {
        display: flex;
        flex-direction: column;
        /*min-height: 390px;*/
        transition: 0.3s ease all;
        cursor: pointer;

        &:hover {
            transform: rotateZ(-1deg) scale(1.03);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
    }


    .cover {
        object-fit: cover;
    }

    .content-card-wrap-gallery {
        position: relative;
        padding: 20px;

        .content-cards {
            display: grid;
            gap: 10px;
            grid-template-columns: repeat(4, 1fr);
            @media (min-width: 900px) {
                grid-template-columns: repeat(7, 1fr);
                gap: 20px
            }
        }
    }

</style>
