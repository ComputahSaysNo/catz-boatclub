<template>
    <div class="admin mt-5 mx-2">
        <div class="container">
            <h1 class="title is-3">Admin Panel</h1>
            <div class="card">
                <div class="card-content">
                    <b-field grouped>
                        <b-field expanded>
                            <b-input @input="message=''" type="email" v-model="email" placeholder="Enter an email..."></b-input>
                        </b-field>
                        <b-button style="width: 100px" icon-right="magnify" type="is-info" @click="getProfile"></b-button>
                    </b-field>
                    <p>{{message}}</p>
                    <div class="card has-background-warning-light" style="width: 400px" v-if="retrievedProfile">
                        <div class="card-content">
                            <p>Name: {{retrievedProfile.name}}</p>
                            <p v-if="isAdmin!==null">Admin: {{(isAdmin) ? 'Yes' : 'No'}}</p>
                            <b-button class="mt-3" type="is-danger" v-if="isAdmin!==null && !isAdmin" @click="setAdmin">Make user admin</b-button>
                            <b-button class="mt-3" type="is-danger" v-if="isAdmin!==null && isAdmin" @click="deleteAdmin">Remove user as admin</b-button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import db from '../firebase/firebaseInit'
    import firebase from 'firebase/app'
    import 'firebase/functions'

    export default {
        name: "Admin",
        data() {
            return {
                email: '',
                retrievedProfile: null,
                message: '',
                isAdmin: null,
            }
        },
        methods: {
            async getProfile() {
                this.retrievedProfile = null
                this.message = ''
                if (this.email.length === 0) {
                    this.message = 'Enter an email!'
                    return
                }
                let records = await db.collection('profiles').where('email', '==', this.email).get()
                if (records.docs.length === 0) {
                    this.message = 'No matching users found'
                } else {
                    this.retrievedProfile = records.docs[0].data()
                    await this.checkAdmin()
                }
            },
            async checkAdmin() {
                const checkAdmin = await firebase.app().functions('europe-west1').httpsCallable('checkIfUserIsAdminByEmail')
                let adminResult = await checkAdmin({email: this.email})
                this.isAdmin = adminResult.data.isAdmin
                console.log(this.isAdmin)
            },
            async setAdmin() {
                const setAdmin = await firebase.app().functions('europe-west1').httpsCallable('setUserAsAdminByEmail')
                setAdmin({email: this.email, value: true}).then(async ()=>{
                    this.isAdmin = true
                })
            },
            async deleteAdmin() {
                const setAdmin = await firebase.app().functions('europe-west1').httpsCallable('setUserAsAdminByEmail')
                setAdmin({email: this.email, value: false}).then(async ()=>{
                    this.isAdmin = false
                })
            }
        }
    }
</script>

<style scoped>

</style>
