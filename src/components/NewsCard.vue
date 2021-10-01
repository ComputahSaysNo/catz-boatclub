<template>
    <div @click="goToPost" class="card">
        <div v-if="!noImg" class="card-image">
            <figure class="image">
                <img :src="post.coverImgURL" class="cover" v-if="post.coverImgURL"/>
                <div :class="['has-background-danger', 'has-background-primary', 'has-background-warning', 'has-background-success', 'has-background-info'][e % 5]"
                     class="filler"
                     v-else>

                </div>
            </figure>
        </div>
        <div class="card-content" v-if="post.loading">
            <b-skeleton animated width="40%"></b-skeleton>
            <b-skeleton animated width="60%"></b-skeleton>
            <b-skeleton animated width="80%"></b-skeleton>
        </div>
        <div class="card-content" v-else>
            <h2 class="subtitle is-6">{{post.title}}</h2>
            <h6 class="card-date is-italic">{{ new Date(post.date).toLocaleString("en-gb", { dateStyle: "long" })
                }}</h6>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ContentCard",
        props: ["post", "noImg"],
        data() {
            return {
                hover1: false,
                hover2: false,
                e: 0,
            }
        },
        methods: {
            goToPost() {
                this.$router.push({name: 'ViewPost', params: {postId: this.post.postId}})
            }
        },
        mounted() {
            if (!this.post.coverImgURL) {
                this.e = this.$store.state.counter
                this.$store.state.counter += 1
            }
        }
    }
</script>

<style lang="scss" scoped>
    .card-title {
        font-size: 20px;
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
    }

    .card {
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

    .filler {
        height: 200px;
    }

    .cover {
        height: 200px;
        object-fit: cover;
    }
</style>
