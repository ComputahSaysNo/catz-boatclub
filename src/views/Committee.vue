<template>
    <div class="committee my-5 mx-1">
        <div class="container">
            <h1 class="title is-3 mb-4" ref="title">SCCBC Committee (2021-22)</h1>
            <hr class="rule">
        </div>

        <div class="content-card-wrap">
            <div class="container">
                <div class="content-cards">
                    <UserCard v-for="(user, index) in this.$store.state.committee" :email="true" :uid="user.uid" :position="user.position" :key="index"></UserCard>
                </div>
            </div>
        </div>
<!--        <div class="add mt-5 mx-6">-->
<!--            <h1 class="title is-5">Add Member</h1>-->
<!--            <b-field class="ml-3">-->
<!--                <b-input placeholder="Position" v-model="position">-->

<!--                </b-input>-->
<!--                <b-autocomplete-->
<!--                        placeholder="Name"-->
<!--                        :data="filteredUserList"-->
<!--                        @typing="getFilteredUsers"-->
<!--                        @select="selected =>{-->
<!--                                    this.uid = selected.uid-->
<!--                                }"-->
<!--                        :append-to-body="true"-->
<!--                        :custom-formatter="(x)=>x.name"-->
<!--                        clearable-->
<!--                >-->
<!--                </b-autocomplete>-->
<!--                <b-button type="is-danger" @click="addMember">Add</b-button>-->
<!--            </b-field>-->
<!--        </div>-->
    </div>
</template>

<script>
    import UserCard from "../components/UserCard";
    import db from "../firebase/firebaseInit";

    export default {
        name: "Committee",
        components: {
            UserCard,
        },
        mounted() {
            this.$store.dispatch('getCommittee')
            this.getUsers()
        },
        methods: {
            getFilteredUsers(text) {
                this.filteredUserList = this.userList.filter((user) => {
                    return user.name.toLowerCase().includes(text.toLowerCase())
                })
            },
            async getUsers() {
                const record = await db.collection('profiles').orderBy('created', "desc")
                const results = await record.get()
                results.forEach((doc) => this.userList.push(doc.data()))
            },
            async addMember() {
                db.collection('committee').doc().set({
                    position: this.position,
                    uid: this.uid.toString(),
                    ord: this.$store.state.committee[this.$store.state.committee.length - 1].ord + 1
                }).then(()=>{
                    this.$store.dispatch('getCommittee')
                    this.uid = ""
                    this.position = ""
                })

            }
        },
        data() {
            return {
                filteredUserList: [],
                userList: [],
                uid: "",
                position: ""
            }
        }
    }
</script>

<style scoped>

</style>
