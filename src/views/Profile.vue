<template>
    <div class="container my-6 mx-auto">
        <div v-if="profile !== undefined">
            <h1 class="title is-3 mx-3">User Profile:</h1>
            <div class="tile is-ancestor my-3 mx-1">
                <div class="tile is-3 is-4-tablet-only is-parent">
                    <div class="tile is-child card card1 is-justify-content-center">
                        <div class="card-image">
                            <div class="image-controls is-flex" v-if="profile.photoURL && editing">
                                <div class="file is-info mr-2">
                                    <b-upload @input="uploadProfilePhoto" accept="image/*" class="file-label"
                                              v-model="photoUpload">
                                    <span class="file-cta">
                                        <b-icon class="file-icon" icon="upload"></b-icon>
                                        <span class="file-label">Upload new</span>
                                        <b-loading :is-full-page="true" v-model="this.loading"></b-loading>
                                    </span>
                                    </b-upload>
                                </div>
                                <b-button icon-right="trash-can-outline" type="is-danger" @click="deleteProfilePhoto"></b-button>
                            </div>
                            <figure class="image is-1by1" v-show="profile.photoURL">
                                <img :src="profile.photoURL" class="profile-image"/>
                            </figure>
                        </div>
                        <div class="card-content">
                            <div class="initials mx-auto my-3" v-if="!profile.photoURL" v-show="!editing"><h3>
                                {{initials}}</h3></div>
                            <b-upload @input="uploadProfilePhoto" accept="image/*" class="initials upload-circle mx-auto my-3"
                                      v-if="!profile.photoURL" v-model="photoUpload" v-show="editing"><p>upload
                                photo</p>
                                <!--                        <b-icon icon="upload"></b-icon>-->
                            </b-upload>
                            <h1 class="title is-3">{{profile.name}}</h1>
                            <p class="is-italic subtitle is-5">{{profile.email}}</p>
                            <div class="roles" v-if="roles">
                                <b-tag :key="index" class="mx-1" type="is-primary" v-for="(name, index) in this.roles">
                                    {{name}}
                                </b-tag>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tile is-parent">
                    <div class="tile is-child box">
                        <div class="is-flex mb-3">
                            <h1 class="title mt-2 is-4 mr-auto">About</h1>
                            <b-button @click="updateProfile"
                                      class="ml-auto"
                                      icon-right="check" type="is-info" v-if="$store.state.authUser && (profile.uid.toString()===$store.state.authUser.uid.toString() || $store.state.isAdmin)" v-show="editing">Done
                            </b-button>
                            <b-button @click="editing=true"
                                      class="ml-auto"
                                      icon-right="pencil" v-if="$store.state.authUser && (profile.uid.toString()===$store.state.authUser.uid.toString() || $store.state.isAdmin)" v-show="!editing">Edit
                            </b-button>
                        </div>

                        <table class="info-table">
                            <tr>
                                <td>Bio:</td>
                                <td v-if="editing">
                                    <b-input placeholder="Tell us something about yourself!" size="is-small"
                                             v-model="profile.bio"></b-input>
                                </td>
                                <td v-else>{{profile.bio}}</td>
                            </tr>
                            <tr>
                                <td>Subject:</td>
                                <td v-if="editing">
                                    <b-input placeholder="What subject do you do?" size="is-small"
                                             v-model="profile.subject"></b-input>
                                </td>
                                <td v-else>{{profile.subject}}</td>
                            </tr>
                            <tr>
                                <td>Matriculated:</td>
                                <td v-if="editing">
                                    <b-input placeholder="Matriculation year" size="is-small" type="number"
                                             v-model="profile.matriculation_year"></b-input>
                                </td>
                                <td v-else>{{profile.matriculation_year}}</td>
                            </tr>
                            <tr>
                                <td>Height:</td>
                                <td v-if="editing">
                                    <b-input placeholder="Height (in cm)" size="is-small" type="number"
                                             v-model="profile.height_cm"></b-input>
                                </td>
                                <td v-else>{{profile.height_cm}}<span v-if="profile.height_cm"> cm</span></td>
                            </tr>
                            <tr>
                                <td>Date of Birth:</td>
                                <td v-if="editing">
                                    <b-datepicker
                                            :first-day-of-week="1"
                                            expanded
                                            placeholder="Select a date"
                                            ref="datepicker"
                                            size="is-small"
                                            v-model="dob">
                                    </b-datepicker>
                                </td>
                                <td v-else-if="profile.dob">{{ (new Date(profile.dob)).toLocaleString("en-gb", { dateStyle:
                                    "long"
                                    }) }}&nbsp;&nbsp;&nbsp;(Age {{age}})
                                </td>
                            </tr>
                            <tr>
                                <td>Account Created:</td>
                                <td>{{ new Date(profile.created).toLocaleString("en-gb", { dateStyle: "long" }) }}</td>
                            </tr>

                        </table>
                    </div>
                </div>
            </div>
            <div class="tile is-ancestor mx-1">
                <div class="tile is-parent">
                    <div class="tile is-child box content-card-wrap">
                        <h1 class="title is-4">Crews</h1>
                        <div class="content-cards" v-if="crews.length!==0">
                            <CrewCard :crew="crew" :key="index" v-for="(crew, index) in this.crews"></CrewCard>
                        </div>
                        <div v-else>
                            <p>User is not in any crews</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="has-text-centered" v-else>
            <p>Profile not found. If you just made an account, this page might take a minute to generate.</p>
        </div>

    </div>
</template>

<script>
    import firebase from 'firebase/app'
    import db from '../firebase/firebaseInit'
    import CrewCard from "../components/CrewCard"

    export default {
        name: "Profile",
        components: {CrewCard},
        methods: {
            async getProfile() {
                const uid = this.$route.params.uid
                const record = await db.collection('profiles').doc(uid)
                const results = await record.get()
                this.profile = results.data()
            },
            async getRoleNames() {
                this.roles = []
                for (let id of this.profile.roles) {
                    const record = await db.collection('roles').doc(id)
                    const result = await record.get()
                    this.roles.push(result.data().name)
                }
            },
            async getCrews() {
                this.crews = []
                const dataBase = await db.collection("crews").orderBy("crewId", "desc")
                const dbResults = await dataBase.get();
                dbResults.forEach((doc) => {
                    let rowers = doc.data().crew
                    if (rowers.includes(this.profile.uid.toString())) {
                        this.crews.push(doc.data())
                    }
                    if (doc.data().cox === this.profile.uid.toString()) {
                        this.crews.push(doc.data())
                    }
                })
            },
            async uploadProfilePhoto() {
                this.loading = true
                const fileRef = firebase.storage().ref().child(`photos/profiles/${this.photoUpload.name}`)
                fileRef.put(this.photoUpload).then(async () => {
                    let downloadURL = await fileRef.getDownloadURL()
                    this.profile.photoURL = downloadURL
                    await db.collection('profiles').doc(this.profile.uid.toString()).update({photoURL: downloadURL})
                    this.loading = false
                    this.editing = false
                })
            },
            async deleteProfilePhoto() {
                this.loading = true
                this.profile.photoURL = null
                await db.collection('profiles').doc(this.profile.uid.toString()).update({photoURL: null})
                this.loading = false
            },
            async updateProfile() {
                this.editing = false
                this.loading = true
                await db.collection('profiles').doc(this.profile.uid.toString()).update(this.profile)
                this.loading = false
            }
        },
        data() {
            return {
                profile: null,
                roles: [],
                crews: [],
                editing: false,
                photoUpload: null,
                loading: false
            }
        },
        mounted() {
            this.getProfile().then(() => {
                if (this.profile !== undefined) {
                    this.getRoleNames().then(() => {
                        this.getCrews()
                    })
                }
            })
        },
        computed: {
            initials() {
                return this.profile.name.match(/(\b\S)?/g).join("")
            },
            dob: {
                get() {
                    if (!this.profile.dob) {
                        return null
                    }
                    return new Date(this.profile.dob)
                },
                set(payload) {
                    this.profile.dob = payload.getTime()
                }
            },
            age() {
                return new Date(Date.now() - this.profile.dob).getUTCFullYear() - 1970
            }
        },
        watch: {
            $route() {
                this.getProfile().then(() => {
                    this.getRoleNames().then(() => {
                        this.getCrews()
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    /*.container {*/
    /*    max-width: 1100px;*/
    /*    min-height: 1000px;*/
    /*}*/

    h1 {
        font-size: 30px;
    }

    h2 {
        font-size: 25px;
    }

    .card1 {
        text-align: center;
    }

    .info-table {
        width: 100%;

        tr {
            td:nth-child(1) {
                width: 20%;
                max-width: 200px;
                font-weight: bold;
            }

            td {
                padding-bottom: 1em;
                padding-left: 0.5em;
            }
        }
    }

    .image-controls {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 999;
    }

    .initials {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        color: #fff;
        background-color: #303030;
        z-index: 2;
        transition: 0.5s;
        font-size: 60px;
    }

    .upload-circle {
        font-size: 20px;

        &:hover {
            transform: scale(1.05);
        }

        background-color: white;
        color: black;
        border: 3px dashed black;
    }

    .profile-image {
        object-fit: cover;
    }
</style>
