<template>
    <div class="container mt-3 mx-2" v-if="profile">
        <h1>{{profile.email}}</h1>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit'

    export default {
        name: "Profile",
        methods: {
            async getProfile() {
                const uid = this.$route.params.uid
                const record =  await db.collection('users').doc(uid)
                const results = await record.get()
                this.profile = results.data()
                console.log(this.profile)
            }
        },
        data() {
            return {
                profile: null
            }
        },
        mounted() {
            this.getProfile()
        }
    }
</script>

<style scoped>

</style>