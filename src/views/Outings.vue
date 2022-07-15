<template>
    <div class="outings mt-5 mx-2">
        <section class="container">
                <h1 class="title is-2 mb-1" ref="title">Outings</h1>
                <p class="is-italic">Edit the spreadsheet <a href="https://docs.google.com/spreadsheets/d/189uIxyVpfgR0iKw2lz9eRjCF2C0sviwIZgbVClTxJ3U/edit?usp=sharing">here</a></p>

            <hr class="rule">
            <div class="card p-5 my-2 has-background-warning-light">
                <iframe class="sheet" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQGE4BM_2QfGTIEPWUUP7ZE3wQ6O9HQlcZbwdsHUGlJJ5EXrrJZfp_e3yQN47uoe_1TGqYiH7IiRb9m/pubhtml?widget=true&amp;headers=false"></iframe>
            </div>
            <b-loading v-model="loading" :is-full-page="true"></b-loading>
<!--            <div class="card mb-6 has-background-warning-light" style="height: 800px;">-->
<!--                <div class="card-content content-card-wrap">-->
<!--                    <div class="is-flex mb-5">-->
<!--                        <h3 class="title is-4 mt-2">Coxed Boats:</h3>-->
<!--                        <b-button @click="modalOpen=true" class="ml-auto" icon-right="pencil" type="is-info"-->
<!--                                  v-if="$store.state.isAdmin">New Outing-->
<!--                        </b-button>-->
<!--                        <b-modal v-model="modalOpen">-->
<!--                            <div class="card createOuting">-->
<!--                                <div class="card-header">-->
<!--                                    <div class="card-header-title">-->
<!--                                        Create new outing-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                                <div class="card-content">-->
<!--                                    <h3 class="title is-6 mb-2">When?</h3>-->
<!--                                    <b-field>-->
<!--                                        <b-datetimepicker :append-to-body="true"-->
<!--                                                          :timepicker="{incrementMinutes: 15}"-->
<!--                                                          :value="(outingForm.timestamp === null) ? null : new Date(outingForm.timestamp)" @input="timestamp=>{outingForm.timestamp = timestamp.getTime();}"-->
<!--                                                          class="mt-0" horizontal-time-picker-->
<!--                                                          icon="calendar"-->
<!--                                                          placeholder="Select date and time..."></b-datetimepicker>-->
<!--                                    </b-field>-->
<!--                                    <hr>-->
<!--                                    <h3 class="title is-6 mt-4 mb-3">Crew Type</h3>-->
<!--                                    <b-field grouped>-->
<!--                                        <b-field>-->
<!--                                            <b-select :value="outingForm.gender" @input="input=>outingForm.gender=parseInt(input)"-->
<!--                                                      class="ml-auto">-->
<!--                                                <option value="0">Men's</option>-->
<!--                                                <option value="1">Women's</option>-->
<!--                                                <option value="2">Mixed</option>-->
<!--                                            </b-select>-->
<!--                                        </b-field>-->
<!--                                        <b-field>-->
<!--                                            <b-select :value="outingForm.boatSize" @input="input=>{outingForm.boatSize=parseInt(input);outingForm.crew=Array(parseInt(input)).fill(null)}"-->
<!--                                                      class="ml-auto">-->
<!--                                                <option value="2">Pair</option>-->
<!--                                                <option value="4">Four</option>-->
<!--                                                <option value="8">Eight</option>-->
<!--                                            </b-select>-->
<!--                                        </b-field>-->

<!--                                    </b-field>-->

<!--                                    <b-field grouped>-->
<!--                                        <b-switch type="is-danger" v-model="outingForm.setCrew">-->
<!--                                            <b-tooltip dashed label="If on, only admins can edit the crew (people can't sign themselves up)"-->
<!--                                                       multilined>-->
<!--                                                Set Crew-->
<!--                                            </b-tooltip>-->
<!--                                        </b-switch>-->

<!--                                    </b-field>-->

<!--                                    <b-field grouped>-->
<!--                                        <b-switch type="is-danger" v-model="outingForm.setPositions">-->
<!--                                            <b-tooltip dashed label="If on, people are assigned seats instead of just being bow side or stroke side"-->
<!--                                                       multilined>-->
<!--                                                Set Positions-->
<!--                                            </b-tooltip>-->
<!--                                        </b-switch>-->
<!--                                    </b-field>-->
<!--                                    <hr>-->
<!--                                    <h3 class="title is-6 mt-5 mb-5">People</h3>-->
<!--                                    <b-field label="Coach" label-position="on-border">-->
<!--                                        <b-autocomplete-->
<!--                                                :data="filteredUserList"-->
<!--                                                @typing="getFilteredUsers"-->
<!--                                                @select="selected =>{-->
<!--                                                    if (selected === null) {outingForm.coach = null}-->
<!--                                                    else {outingForm.coach = selected.uid.toString()}-->
<!--                                                }"-->
<!--                                                :append-to-body="true"-->
<!--                                                :custom-formatter="(x)=>x.name"-->
<!--                                                clearable-->
<!--                                        >-->
<!--                                        </b-autocomplete>-->
<!--                                    </b-field>-->
<!--                                    <div class="mt-6" v-if="outingForm.setCrew">-->
<!--                                        <b-field :key="index" :label="(outingForm.setPositions) ? ((index === outingForm.boatSize) ? 'Stroke' : positions[index - 1])  : (index <= Math.floor(outingForm.boatSize / 2)) ? 'Bow Side': 'Stroke Side'"-->
<!--                                                 label-position="on-border"-->
<!--                                                 v-for="index in outingForm.boatSize">-->
<!--                                            <b-autocomplete-->
<!--                                                    :append-to-body="true"-->
<!--                                                    :custom-formatter="(x)=>x.name"-->
<!--                                                    :data="filteredUserList"-->
<!--                                                    @select="selected => formSelectUser(selected, index-1)"-->
<!--                                                    @typing="getFilteredUsers"-->
<!--                                                    clearable-->
<!--                                            >-->
<!--                                            </b-autocomplete>-->
<!--                                        </b-field>-->
<!--                                        <b-field label="Cox" label-position="on-border">-->
<!--                                            <b-autocomplete-->
<!--                                                    :append-to-body="true"-->
<!--                                                    :custom-formatter="(x)=>x.name"-->
<!--                                                    :data="filteredUserList"-->
<!--                                                    @select="selected =>{-->
<!--                                                            if (selected === null) {outingForm.cox = null}-->
<!--                                                            else {outingForm.cox = selected.uid.toString()}-->
<!--                                                        }"-->
<!--                                                    @typing="getFilteredUsers"-->
<!--                                                    clearable-->
<!--                                            >-->
<!--                                            </b-autocomplete>-->
<!--                                        </b-field>-->
<!--                                    </div>-->
<!--                                    <hr>-->
<!--                                    <h3 class="title is-6 mb-3">Description</h3>-->
<!--                                    <b-input placeholder="(optional) What are you doing in the outing?"></b-input>-->
<!--                                    <hr>-->
<!--                                    <b-button @click="createOuting" class="card-footer-item ml-auto" icon-right="arrow-right" type="is-info">Submit</b-button>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </b-modal>-->
<!--                    </div>-->

<!--                    <div class="content-cards">-->
<!--                        <b-loading :is-full-page="false" v-model="loadingEights"></b-loading>-->
<!--                        <div :key="outingIndex" class="card outingCard" v-for="(outing, outingIndex) in outings">-->
<!--                            <div :class="[' has-background-info', ' has-background-danger', ' has-background-success'][outing.gender]"-->
<!--                                 class="card-header p-3">-->
<!--                                <div class="has-text-light">-->
<!--                                    <b-field v-if="outing.editing">-->
<!--                                        <b-select @input="updateOutingRecord(outingIndex)" size="is-small"-->
<!--                                                  v-model="outing.gender">-->
<!--                                            <option value="0">Men's</option>-->
<!--                                            <option value="1">Women's</option>-->
<!--                                            <option value="2">Mixed</option>-->
<!--                                        </b-select>-->
<!--                                    </b-field>-->
<!--                                    <b-tag :class="['has-background-info-light', 'has-background-danger-light', 'has-background-success-light'][outing.gender]"-->
<!--                                           class="gender has-text-weight-bold"-->
<!--                                           type="is-light" v-else>-->
<!--                                        {{['Men\'s', 'Women\'s', 'Mixed'][outing.gender]}}-->
<!--                                    </b-tag>-->
<!--                                    <b-field class="mb-1" v-if="outing.editing">-->
<!--                                        <b-datetimepicker :timepicker="{incrementMinutes: 15}" :value="new Date(outing.timestamp)"-->
<!--                                                          @input="timestamp=>{outing.timestamp = timestamp.getTime(); updateOutingRecord(outingIndex)}" horizontal-time-picker-->
<!--                                                          icon="calendar" placeholder="Select date and time..."-->
<!--                                                          size="is-small"></b-datetimepicker>-->
<!--                                    </b-field>-->
<!--                                    <p class="title is-6 has-text-white" v-else>{{(new-->
<!--                                        Date(outing.timestamp).toLocaleString('en-gb', {-->
<!--                                        weekday: 'long',-->
<!--                                        day: 'numeric',-->
<!--                                        month: 'numeric',-->
<!--                                        hour12: true,-->
<!--                                        hour: 'numeric',-->
<!--                                        minute: 'numeric'-->
<!--                                        })).replace(',', '')}}</p>-->

<!--                                    <b-field v-if="outing.editing">-->
<!--                                        <b-autocomplete :append-to-body="true"-->
<!--                                                        :custom-formatter="(x)=>x.name"-->

<!--                                                        :data="filteredUserList"-->
<!--                                                        :value="(outing.coach) ? outing.coach.name : null"-->
<!--                                                        @select="selected => {outing.coach=selected;updateOutingRecord(outingIndex)}"-->
<!--                                                        @typing="getFilteredUsers"-->
<!--                                                        icon="account-star"-->
<!--                                                        placeholder="Coach"-->
<!--                                                        size="is-small"-->
<!--                                        ></b-autocomplete>-->
<!--                                    </b-field>-->
<!--                                    <p class="subtitle is-6 has-text-white mb-1"-->
<!--                                       v-else-if="outing.coach !== undefined && outing.coach !== null">-->
<!--                                        coached by {{outing.coach.name}}</p>-->
<!--                                    <p v-else class="subtitle is-6 has-text-white mb-1">&nbsp;</p>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <div>-->
<!--                                <table style="width: 100%">-->
<!--                                    <tr :class="['has-background-white',[' has-background-info-light', ' has-background-danger-light', ' has-background-success-light'][outing.gender]][index%2]"-->
<!--                                        :key="index"-->
<!--                                        v-for="(user, index) in outing.crew">-->
<!--                                        <td class="p-3">-->
<!--                                            <b v-if="outing.setPositions">{{positions[index]}}:</b>-->
<!--                                            <b v-else-if="index===0">Bow Side:</b>-->
<!--                                            <b v-else-if="index===Math.floor(outing.boatSize / 2)">Stroke Side:</b>-->
<!--                                            <b v-else>-->
<!--                                                <b-icon icon="circle-small" size="is-small"></b-icon>-->
<!--                                            </b>-->
<!--                                        </td>-->
<!--                                        <td class="p-3">-->
<!--                                            <span :class="($store.state.authUser !== null && (user.uid.toString() === $store.state.authUser.uid.toString()) ? 'has-text-weight-bold':'')"-->
<!--                                                  v-if="user !== null">{{user.name}}-->
<!--                                            </span>-->
<!--                                            <span-->
<!--                                                    v-else-if="outing.editing && $store.state.authUser !== null && $store.state.isAdmin && user===null">-->
<!--                                                <b-autocomplete-->
<!--                                                        :append-to-body="true"-->
<!--                                                        :custom-formatter="(x)=>x.name"-->
<!--                                                        :data="filteredUserList"-->
<!--                                                        @select="selected => selectUser(outingIndex, index, selected)"-->
<!--                                                        @typing="getFilteredUsers"-->
<!--                                                        size="is-small"-->
<!--                                                ></b-autocomplete>-->
<!--                                            </span>-->


<!--                                        </td>-->
<!--                                        <td class="p-3">-->
<!--                                            <div @click="takeSlot(outingIndex, index)"-->
<!--                                                 v-if="!outing.setCrew && $store.state.authUser !== null && user === null && !outing.crewUIDs.includes($store.state.authUser.uid.toString()) && !(outing.cox !== null && outing.cox.uid === $store.state.authUser.uid.toString()) && !$store.state.isAdmin">-->
<!--                                                <b-icon-->
<!--                                                        class="p-3 has-background-success has-text-white"-->
<!--                                                        icon="arrow-right"-->
<!--                                                        size="is-small"-->
<!--                                                        style="border-radius: 50%"></b-icon>-->
<!--                                            </div>-->
<!--                                            <div @click="removeSlot(outingIndex, index)"-->
<!--                                                 v-else-if="!($store.state.isAdmin && !outing.editing) && $store.state.authUser !== null && user !== null && (user.uid.toString() === $store.state.authUser.uid.toString() || $store.state.isAdmin)">-->
<!--                                                <b-icon class="has-background-danger has-text-white p-3" icon="close"-->
<!--                                                        size="is-small" style="border-radius: 50%"-->
<!--                                                >-->
<!--                                                </b-icon>-->
<!--                                            </div>-->
<!--                                        </td>-->
<!--                                    </tr>-->
<!--                                    <tr>-->
<!--                                        <td class="p-3">-->
<!--                                            <b>Cox:</b>-->
<!--                                        </td>-->
<!--                                        <td class="p-3">-->
<!--                                            <span-->
<!--                                                    v-if="outing.editing && $store.state.authUser !== null && $store.state.isAdmin && outing.cox ===null">-->
<!--                                                    <b-autocomplete :append-to-body="true"-->
<!--                                                                    :custom-formatter="(x)=>x.name"-->
<!--                                                                    :data="filteredUserList"-->
<!--                                                                    @select="selected => {if(selected===null){$set(outings[outingIndex], 'cox', null)}else{$set(outings[outingIndex], 'cox', selected)}updateOutingRecord(outingIndex)}"-->
<!--                                                                    @typing="getFilteredUsers"-->
<!--                                                                    size="is-small"-->
<!--                                                    ></b-autocomplete>-->
<!--                                            </span>-->
<!--                                            <span v-if="outing.cox !== null">{{outing.cox.name}}</span>-->
<!--                                        </td>-->
<!--                                        <td class="p-3">-->
<!--                                            <div @click="()=>{$set(outings[outingIndex], 'cox', $store.state.profile);updateOutingRecord(outingIndex)}"-->
<!--                                                 v-if="!outing.setCrew && outing.cox===null && $store.state.authUser !== null && !outing.crewUIDs.includes($store.state.authUser.uid.toString()) && !$store.state.isAdmin">-->
<!--                                                <b-icon-->
<!--                                                        class="p-3 has-background-success has-text-white"-->
<!--                                                        icon="arrow-right"-->
<!--                                                        size="is-small"-->
<!--                                                        style="border-radius: 50%"></b-icon>-->
<!--                                            </div>-->
<!--                                            <div @click="$set(outings[outingIndex], 'cox', null);updateOutingRecord(outingIndex)">-->
<!--                                                <b-icon class="has-background-danger has-text-white p-3" icon="close"-->
<!--                                                        size="is-small" style="border-radius: 50%"-->
<!--                                                        v-if="!($store.state.isAdmin && !outing.editing) && $store.state.authUser !== null && outing.cox !== null && (outing.cox.uid.toString() === $store.state.authUser.uid.toString() || $store.state.isAdmin)">-->
<!--                                                </b-icon>-->
<!--                                            </div>-->
<!--                                        </td>-->
<!--                                    </tr>-->
<!--                                </table>-->
<!--                            </div>-->
<!--                            <div class="card-footer p-2" v-if="$store.state.isAdmin">-->
<!--                                <div class="controls is-flex">-->
<!--                                    <div @click="outing.editing=true">-->
<!--                                        <b-icon class="has-background-info has-text-white p-4 mr-2" icon="pencil"-->
<!--                                                style="border-radius: 20%;cursor:pointer"-->
<!--                                                v-if="!outing.editing"/>-->
<!--                                    </div>-->
<!--                                    <div @click="outing.editing=false">-->
<!--                                        <b-icon class="has-background-success has-text-white p-4 mr-2" icon="check"-->
<!--                                                style="border-radius: 20%;cursor:pointer"-->
<!--                                                v-if="outing.editing"/>-->
<!--                                    </div>-->
<!--                                    <div @click="deleteOuting(outingIndex)">-->
<!--                                        <b-icon class="has-background-danger has-text-white p-4"-->
<!--                                                icon="trash-can-outline"-->
<!--                                                style="border-radius: 20%;cursor:pointer"/>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
        </section>
    </div>
</template>

<script>
    import db from '../firebase/firebaseInit'

    export default {
        name: "Outings",
        methods: {
            async getOutings() {
                this.loadingEights = true
                const record = await db.collection('outings').where('timestamp', '>=', Date.now() - 86400000).get()
                for (let doc of record.docs) {
                    let data = doc.data()
                    let info = {
                        timestamp: data.timestamp,
                        description: data.description,
                        gender: data.gender,
                        outingId: data.outingId,
                        setCrew: data.setCrew,
                        setPositions: data.setPositions,
                        crewUIDs: data.crew,
                        boatSize: data.boatSize,
                        editing: false,
                    }
                    info.crew = []
                    for (let uid of data.crew) {
                        if (uid !== null) {
                            await db.collection('profiles').doc(uid.toString()).get().then((doc) => {
                                if (doc.exists) {
                                    let foo = doc.data()
                                    // if (foo.uid.toString() === this.$store.state.authUser.uid.toString()) {
                                    //     foo.name = 'You!'
                                    // }
                                    info.crew.push(foo)
                                } else {
                                    info.crew.push(null)
                                }
                            })
                        } else {
                            info.crew.push(null)
                        }
                    }
                    if (data.cox !== null) {
                        await db.collection('profiles').doc(data.cox).get().then((doc) => info.cox = doc.data())
                    } else {
                        info.cox = null
                    }
                    if (data.coach !== null) {
                        await db.collection('profiles').doc(data.coach).get().then((doc) => info.coach = doc.data())
                    } else {
                        info.coach = null
                    }
                    this.outings.push(info)

                }
                this.loadingEights = false
            },
            takeSlot(outingIndex, index) {
                this.$set(this.outings[outingIndex].crew, index, this.$store.state.profile)
                this.$set(this.outings[outingIndex].crewUIDs, index, this.$store.state.authUser.uid.toString())
                this.updateOutingRecord(outingIndex)
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
            removeSlot(outingIndex, index) {
                this.$set(this.outings[outingIndex].crew, index, null)
                this.$set(this.outings[outingIndex].crewUIDs, index, null)
                this.updateOutingRecord(outingIndex)
            },
            selectUser(outingIndex, index, selected) {
                if (selected === null) {
                    this.$set(this.outings[outingIndex].crew, index, null)
                    this.$set(this.outings[outingIndex].crewUIDs, index, null)
                } else {
                    this.$set(this.outings[outingIndex].crew, index, selected)
                    this.$set(this.outings[outingIndex].crewUIDs, index, selected.uid.toString())
                }
                this.updateOutingRecord(outingIndex)
            },
            async updateOutingRecord(outingIndex) {
                let outing = this.outings[outingIndex]
                await db.collection('outings').doc(outing.outingId).update({
                    gender: parseInt(outing.gender),
                    crew: outing.crewUIDs,
                    cox: (outing.cox === null) ? null : outing.cox.uid.toString(),
                    coach: (outing.coach === null) ? null : outing.coach.uid.toString(),
                    timestamp: outing.timestamp,
                })
            },
            formSelectUser(selected, index) {
                if (selected === null) {
                    this.outingForm.crew[index] = null
                } else {
                    this.outingForm.crew[index] = selected.uid.toString()
                }
            },
            async createOuting() {
                this.loading = true
                let uploadData = this.outingForm
                const record = await db.collection('outings').doc()
                uploadData.outingId = record.id
                record.set(uploadData).then(async ()=>{
                    let cardData = {
                        timestamp: uploadData.timestamp,
                        description: uploadData.description,
                        gender: uploadData.gender,
                        outingId: uploadData.outingId,
                        setCrew: uploadData.setCrew,
                        setPositions: uploadData.setPositions,
                        crewUIDs: uploadData.crew,
                        editing: false,
                        boatSize: uploadData.boatSize,
                        crew: [],
                    }
                    for (let uid of uploadData.crew) {
                        if (uid !== null) {
                            await db.collection('profiles').doc(uid.toString()).get().then((doc) => {
                                if (doc.exists) {
                                    cardData.crew.push(doc.data())
                                } else {
                                    cardData.crew.push(null)
                                }
                            })
                        } else {
                            cardData.crew.push(null)
                        }
                    }
                    if (uploadData.cox !== null) {
                        await db.collection('profiles').doc(uploadData.cox).get().then((doc) => cardData.cox = doc.data())
                    } else {
                        cardData.cox = null
                    }
                    if (uploadData.coach !== null) {
                        await db.collection('profiles').doc(uploadData.coach).get().then((doc) => cardData.coach = doc.data())
                    } else {
                        cardData.coach = null
                    }
                    this.outings.push(cardData)
                    this.outings.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))
                    this.loading = false
                    this.modalOpen = false
                })
            },
            async deleteOuting(outingIndex) {
                this.$buefy.dialog.confirm({
                    message: 'Are you sure you want to cancel this outing? This cannot be undone',
                    confirmText: 'Cancel Outing',
                    type: 'is-danger',
                    onConfirm: async ()=> {
                        let id = this.outings[outingIndex].outingId
                        this.outings.splice(outingIndex, 1)
                        await db.collection('outings').doc(id).delete()
                    }
                })

            }
        },
        data() {
            return {
                outings: [],
                positions: ['Bow', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Stroke'],
                userList: [],
                filteredUserList: [],
                loadingEights: true,
                loading: false,
                modalOpen: false,
                outingForm: {
                    timestamp: null,
                    coach: null,
                    cox: null,
                    crew: [null, null, null, null, null, null, null, null],
                    description: "",
                    gender: 0,
                    setCrew: false,
                    setPositions: false,
                    boatSize: 8,
                }
            }
        },
        async created() {
            await this.getUsers()
            await this.getOutings()
        },
        mounted() {
            if (this.$store.state.authUser === null) {
                this.$buefy.toast.open({message: 'Log in to sign up to outings!', type: 'is-info'})
            }
        }
    }
</script>

<style lang="scss" scoped>
    td {
        padding-bottom: 1em;

    }

    td:nth-child(1) {
        padding-right: 3em;
    }

    .content-card-wrap {
        position: relative;
        padding: 20px;


        .content-cards {
            display: grid;
            gap: 40px;
            grid-template-columns: repeat(1, 1fr);
            @media (min-width: 600px) {
                grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 900px) {
                grid-template-columns: repeat(3, 1fr);
            }
            @media (min-width: 1400px) {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    }

    .gender {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .controls {

    }

    .createOuting {
        width: 400px;
        overflow: visible;
        margin: auto;
    }

    .outingCard {
        height: max-content;
    }

    .sheet {
        width: 100%;
        height: 800px;
    }
</style>
