<template>
    <div v-if="crew!==null">
        <div class="container my-6 mx-auto">
            <div class="tile is-ancestor container mx-2">
                <div class="tile is-parent is-7">
                    <div class="tile is-child card">
                        <div class="card-content">
                            <div class="edit">
                                <b-button @click="updateCrew"

                                          icon-left="check" type="is-info" v-if="$store.state.isAdmin" v-show="editing">
                                </b-button>
                                <b-button @click="editing=true"

                                          icon-right="pencil" v-if="$store.state.isAdmin" v-show="!editing">
                                </b-button>

                            </div>
                            <b-field v-if="editing" label="Name" label-position="on-border">
                                <b-input required v-model="crew.name" style="width: 80%"></b-input>
                            </b-field>
                            <h1 v-else class="title">{{crew.name}}</h1>
                            <div class="is-flex mt-3" v-if="editing">
                                <b-field grouped>
                                    <b-field label="Term" label-position="on-border">
                                        <b-select v-model="crew.term">
                                            <option value="0">None</option>
                                            <option value="1">Michaelmas</option>
                                            <option value="2">Lent</option>
                                            <option value="3">Easter</option>
                                        </b-select>
                                    </b-field>
                                    <b-field label="Year" label-position="on-border" class="mx-2" style="width: 100px;">
                                        <b-input v-model="crew.year" min="1990" required type="number"></b-input>
                                    </b-field>
                                    <b-field label="Gender" label-position="on-border">
                                        <b-select v-model="crew.gender">
                                            <option value="0">Men's</option>
                                            <option value="1">Women's</option>
                                            <option value="2">Mixed</option>
                                        </b-select>
                                    </b-field>
                                </b-field>

                            </div>
                            <p v-else class="is-italic subtitle is-5"><span v-if="term">{{term}} Term,</span> {{crew.year}}</p>
                        </div>
                    </div>
                </div>
                <div class="tile is-parent is-3 has-text-centered is-justify-content-center" style="width: max-content">
                    <div class="tile is-child card p-3" v-if="bumps.length !== 0 || editing">
                        <h3 class="title is-5 mt-1 mb-3 mr-5">Bumps Results:</h3>
                        <b-field v-if="editing" grouped class="mt-5 ml-1">
                            <b-field v-for="n in 4" :key="n" :label="`Day ${n}`" label-position="on-border">
                                <b-input class="e" type="number" :value="0" v-model="crew.bumps_results[n-1]">
                                </b-input>
                            </b-field>
                        </b-field>
                        <b-tag v-else :key="index" :type="['is-danger','is-info', 'is-success', 'is-primary', 'is-primary', 'is-primary'][val + 1]" class="mr-3" rounded
                               size="is-medium"
                               v-for="(val, index) in bumps">
                            <p><span v-if="val>0">+</span>{{val}}</p>
                        </b-tag>
                    </div>
                </div>
<!--                <div class="tile is-parent" v-if="sub_profiles.length !== 0 || coach !== null">-->
<!--                    <div class="tile is-child card p-5">-->
<!--                        <div class="center">-->
<!--                            <p><b>Coach:</b> <span class="mx-2"/> {{coach.name}}</p>-->
<!--                            <p><b>Subs:</b> <span class="mx-2"/>  <span class="mr-2" :key="index" v-for="(user, index) in sub_profiles">{{user.name}}<span v-if="index !== sub_profiles.length - 1">,</span></span></p>-->
<!--                        </div>-->

<!--                    </div>-->
<!--                </div>-->
            </div>
        </div>
        <div class="mx-auto" v-if="crew">
            <section class="content-card-wrap-special section has-background-warning-light px-6 my-5">
                <div class="content-cards">
                    <UserCard :key="index" :uid="uid" :position="['Bow', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Stroke'][index]"
                              v-for="(uid, index) in this.crew.crew"></UserCard>
                    <UserCard :key="index" :uid="this.crew.cox" :position="'Cox'"></UserCard>
                </div>
            </section>

            <div v-if="reports.length !== 0" class="tile is-ancestor container mx-auto">
                <div class="tile is-parent">
                    <div class="tile card is-child content-card-wrap-mini">
                        <h3 class="title is-5">Race Reports:</h3>
                        <div class="content-cards">
                            <NewsCard noImg=true v-for="(post, index) in this.reports" :key=index :post="post"></NewsCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import db from "../firebase/firebaseInit";
    import UserCard from "../components/UserCard";
    import NewsCard from "../components/NewsCard";

    export default {
        name: "ViewCrew",
        components: {UserCard, NewsCard},
        data() {
            return {
                crew: null,
                user_profiles: [],
                coach: null,
                sub_profiles: [],
                reports: [],
                editing: false,
            }
        },
        methods: {
            async getCrew() {
                const crewId = this.$route.params.crewId
                const record = await db.collection('crews').doc(crewId)
                const results = await record.get()
                this.crew = results.data()
            },
            async getProfiles() {
                let i = 0
                for (let uid of this.crew.crew.concat([this.crew.cox])) {
                    if (uid === null) {
                        i++;
                        continue
                    }
                    const record = await db.collection('profiles').doc(uid)
                    const results = await record.get()
                    this.user_profiles.push({
                        name: results.data().name,
                        photoURL: results.data().photoURL,
                        uid: results.data().uid.toString(),
                        position: ['Bow', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Stroke', 'Cox'][i]
                    })
                    i++;
                }
                for (let uid of this.crew.subs) {
                    if (uid === null) {
                        continue
                    }
                    const record = await db.collection('profiles').doc(uid)
                    const results = await record.get()
                    this.sub_profiles.push({
                        name: results.data().name,
                        photoURL: results.data().photoURL,
                        uid: results.data().uid.toString(),
                    })
                    i++;
                }
                if (this.crew.coach !== null) {
                    const record = await db.collection('profiles').doc(this.crew.coach)
                    const results = await record.get()
                    this.coach = results.data()
                }

            },
            async getReports() {
                this.reports = this.$store.state.loadedNewsCards.filter((post)=>post.crews.includes(this.crew.crewId))
            },
            async updateCrew() {
                this.editing = false
                this.crew.bumps_results = this.bumps
                await db.collection('crews').doc(this.crew.crewId).update(this.crew)
                let updated = []
                for (let crew of this.$store.state.loadedCrewCards) {
                    if (crew.crewId === this.crew.crewId) {
                        updated.push(this.crew)
                    } else {
                        updated.push(crew)
                    }
                }
                this.$store.state.loadedCrewCards = updated
            }
           },
        async mounted() {
            this.getCrew().then(() => {
                this.getProfiles()
                this.getReports()
            })

        },
        computed: {
            term() {
                return ['', 'Michaelmas', 'Lent', 'Easter'][this.crew.term]
            },
            bumps() {
                let out = []
                for (let result of this.crew.bumps_results) {
                    if (result !== null && !isNaN(result)) {
                        out.push(parseInt(result))
                    }
                }
                return out
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        width: 500px;
    }


    .content-card-wrap-special {
        position: relative;
        padding: 20px;

        .content-cards {
            display: grid;
            column-gap: 10px;
            row-gap: 50px;
            grid-template-columns: repeat(2, 1fr);
            @media (min-width: 1000px) {
                grid-template-columns: repeat(4, 1fr);
            }
            @media (min-width: 1750px) {
                grid-template-columns: repeat(9, 1fr);
            }
        }
    }

    .content-card-wrap-mini {
        position: relative;
        padding: 20px;

        .content-cards {
            display: grid;
            column-gap: 10px;
            row-gap: 50px;
            grid-template-columns: repeat(2, 1fr);
            @media (min-width: 1200px) {
                grid-template-columns: repeat(5, 1fr);
            }
        }
    }

    .bottom {
        width: max-content;
        min-width: 300px;
    }

    .info-table {
        tr {
            td:nth-child(1) {
                width: 20%;
                max-width: 200px;
                font-weight: bold;
            }

            td {
                padding-bottom: 1em;
                padding-left: 0.5em;
                font-size: 16px;
            }
        }
    }

    .edit {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .e {
        width: 60px;
    }
</style>
