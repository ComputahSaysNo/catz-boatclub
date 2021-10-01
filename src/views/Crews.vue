<template>
    <div>
        <div class="crews mt-5 mx-2" v-if="crews_years">
            <div class="container">
                <div class="is-block-mobile is-flex-desktop">
                    <h1 class="title is-2 mb-1" ref="title">SCCBC Crews</h1>
                    <div class="ml-auto is-flex">
                        <b-button @click="modalOpen=true" class="new-post mr-2" icon-right="pencil" type="is-info"
                                  v-if="$store.state.isAdmin">New Crew
                        </b-button>
                        <b-input icon-right="magnify" @input="search" class="search" placeholder="search..." v-model="searchQuery"></b-input>
                    </div>


                </div>

                <hr class="rule">
                <div :key="index" v-for="(year, index) in this.years">
                    <div class="content-card-wrap-crews card my-5 has-background-warning-light"
                         v-if="crews_years[year].length !==0">
                        <h1 class="title is-4 mt-3 mb-3">{{year}}</h1>
                        <div class="content-cards">
                            <CrewCard :crew="crew" :key="index" v-for="(crew, index) in crews_years[year]"></CrewCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal v-model="modalOpen">
            <div class="card createCrew">
                <div class="card-header">
                    <h1 class="card-header-title">
                        Create new crew
                    </h1>
                </div>
                <div class="card-content">
                    <b-field label="Name" label-position="on-border" class="mb-5">
                        <b-input required v-model="newCrewData.name"></b-input>
                    </b-field>
                    <b-field grouped class="mb-5">
                        <b-field label="Term" label-position="on-border">
                            <b-select v-model="newCrewData.term">
                                <option value="0">None</option>
                                <option value="1">Michaelmas</option>
                                <option value="2">Lent</option>
                                <option value="3">Easter</option>
                            </b-select>
                        </b-field>
                        <b-field label="Year" label-position="on-border">
                            <b-input v-model="newCrewData.year" min="1990" required type="number"></b-input>
                        </b-field>
                    </b-field>
                    <b-field label="Gender" label-position="on-border">
                        <b-select v-model="newCrewData.gender">
                            <option value="0">Men's</option>
                            <option value="1">Women's</option>
                            <option value="2">Mixed</option>
                        </b-select>
                    </b-field>
                    <br>
                    <h3 class="title is-6">Members:</h3>
                    <p class="subtitle is-6">(for smaller boats, leave relevant fields blank)</p>

                    <b-field v-for="(position, index) in this.positions" :key="index" :label="position" label-position="on-border">
                        <b-autocomplete
                                :data="filteredUserList"
                                @typing="getFilteredUsers"
                                @select="selected => selectUser(selected, index)"
                                :append-to-body="true"
                                :custom-formatter="(x)=>x.name"
                                clearable
                        >
                        </b-autocomplete>
                    </b-field>
                    <b-field label="Cox" label-position="on-border">
                        <b-autocomplete
                                :data="filteredUserList"
                                @typing="getFilteredUsers"
                                @select="selected =>{
                                    if (selected === null) {newCrewData.cox = null}
                                    else {newCrewData.cox = selected.uid.toString()}
                                }"
                                :append-to-body="true"
                                :custom-formatter="(x)=>x.name"
                                clearable
                        >
                        </b-autocomplete>
                    </b-field>
                    <b-field label="Coach" label-position="on-border">
                        <b-autocomplete
                                :data="filteredUserList"
                                @typing="getFilteredUsers"
                                @select="selected =>{
                                    if (selected === null) {newCrewData.coach = null}
                                    else {newCrewData.coach = selected.uid.toString()}
                                }"
                                :append-to-body="true"
                                :custom-formatter="(x)=>x.name"
                                clearable
                        >
                        </b-autocomplete>
                    </b-field>
                    <hr>
                    <b-field label="Subs (type multiple)" label-position="on-border" class="mb-5">
                        <b-taginput
                                autocomplete
                                :data="filteredUserList"
                                @typing="getFilteredUsers"
                                field="name"
                                v-model="newCrewData.subs"
                                :append-to-body="true"
                                type="is-warning"
                                attached
                        >
                        </b-taginput>
                    </b-field>
                    <h3 class="title is-6">Bumps Results:</h3>
                    <p class="subtitle is-6">(number of places changed, leave blank if crew hasn't raced yet)</p>
                    <b-field grouped>
                        <b-field v-for="n in 4" :key="n" :label="`Day ${n}`" label-position="on-border">
                            <b-input class="e" type="number" :value="0" v-model="newCrewData.bumps_results[n-1]">
                            </b-input>
                        </b-field>
                    </b-field>
                    <b-button class="card-footer-item ml-auto mt-6" icon-right="arrow-right" type="is-info" @click="createCrew">Submit</b-button>
                </div>
            </div>


        </b-modal>
    </div>
</template>

<script>
    import CrewCard from "../components/CrewCard";
    import db from '../firebase/firebaseInit'

    export default {
        name: "Crews",
        components: {CrewCard},
        async created() {
            this.$store.dispatch('getCrewCards').then(() => {
                this.displayedCards = this.$store.state.loadedCrewCards
                this.sort_crews()
            })
            await this.getUsers()
        },
        methods: {
            search() {
                this.displayedCards = this.$store.state.loadedCrewCards.filter(card => {
                    return card.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                })
                this.sort_crews()
            },
            sort_crews() {
                this.crews_years = {}
                if (this.displayedCards.length !== 0) {
                    let end_year = 3000
                    let start_year = 0
                    for (let i = start_year; i <= end_year; i++) {
                        this.crews_years[i.toString()] = []
                    }
                    for (let crew of this.displayedCards) {
                        this.crews_years[crew.year.toString()].push(crew)
                    }
                }
                for (let year in this.crews_years) {
                    this.crews_years[year].sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                }
            },
            async getUsers() {
                const record = await db.collection('profiles').orderBy('created', "desc")
                const results = await record.get()
                results.forEach((doc) => this.userList.push(doc.data()))
            },
            getFilteredUsers(text) {
                this.filteredUserList = this.userList.filter((user) => {
                    return user.name.toLowerCase().includes(text.toLowerCase())
                })
            },
            selectUser(selected, index) {
                if (selected === null) {this.newCrewData.crew[index] = null}
                else { this.newCrewData.crew[index] = selected.uid.toString() }
            },
            async createCrew() {
                this.loading = true
                let uploadData = this.newCrewData
                let subIds = []
                let bumpInts = []
                for (let user of this.newCrewData.subs) {
                    subIds.push(user.uid.toString())
                }
                for (let day of this.newCrewData.bumps_results) {
                    if (day === null) {bumpInts.push(null)}
                    else { bumpInts.push(parseInt(day))}
                }
                uploadData.subs = subIds
                uploadData.bumps_results = bumpInts
                const record = await db.collection('crews').doc()
                uploadData.crewId = record.id
                record.set(uploadData).then(()=>{
                    this.loading = false
                    this.$router.push({name: 'ViewCrew', params: {crewId: record.id}})
                })
            }
        },
        data() {
            return {
                displayedCards: [],
                crews_years: null,
                searchQuery: '',
                modalOpen: false,
                newCrewData: {
                    name: '',
                    term: 0,
                    year: new Date().getFullYear(),
                    bumps_results: [null, null, null, null],
                    coach: null,
                    crew: [null, null, null, null, null, null, null, null],
                    cox: null,
                    gender: 2,
                    subs: []
                },
                userList: [],
                filteredUserList: [],
                positions: ["Bow", "Two", "Three", "Four", "Five", "Six", "Seven", "Stroke"]
            }
        },
        computed: {
            years() {
                return Object.keys(this.crews_years).sort((a, b) => b - a)
            }
        }
    }
</script>

<style lang="scss" scoped>

    .content-card-wrap-crews {
        position: relative;
        padding: 20px;


        .content-cards {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(2, 1fr);
            @media (min-width: 1000px) {
                grid-template-columns: repeat(4, 1fr);
            }
            @media (min-width: 1500px) {
                grid-template-columns: repeat(6, 1fr);
            }
        }
    }

    .search {
        width: 300px;
    }

    .createCrew {
        width: 500px;
        overflow: visible;
        margin: auto;
    }

    .e {
        width: 100px;
    }
</style>
