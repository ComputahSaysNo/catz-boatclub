<template>
    <div class="has-text-centered">
        <b-tag size="is-medium" type="is-warning" class="position mb-2"><b>{{profile.position}}</b></b-tag>
        <div class="card" @click="goToProfile">
<!--            <div class="card-image" v-show="profile.photoURL">-->
<!--                <figure class="image is-1by1">-->
<!--                    <img v-if="profile.photoURL" :src="profile.photoURL"/>-->
<!--                </figure>-->
<!--            </div>-->
            <div class="card-content">
                <div class="initials mx-auto my-3"><h3>{{initials}}</h3></div>
                <h2 class="card-title">{{profile.name}}</h2>
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        name: "UserCard",
        props: ["profile"],
        methods: {
            goToProfile() {
                this.$router.push({name: 'Profile', params: {uid: this.profile.uid}})
            }
        },
        computed: {
            initials() {
                return this.profile.name.match(/(\b\S)?/g).join("");
            },
        }
    }
</script>

<style lang="scss" scoped>

    .card-title {
        font-size: 16px;
    }

    .card-date {
        margin-top: auto;
        font-size: 14px;
    }

    .card-content {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        height: 100%;
        text-align: center;
    }

    .card {
        transition: 0.3s ease all;
        cursor: pointer;
        height: 80%;

        &:hover {
            transform: rotateZ(-1deg) scale(1.03);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
    }


    .initials {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        color: #fff;
        background-color: #303030;
        z-index: 2;
        transition: 0.2s;
        font-size: 25px;
    }
</style>
