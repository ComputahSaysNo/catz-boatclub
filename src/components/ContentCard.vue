<template>
    <div class="card" @click="goToPost">
        <div class="card-image">
            <figure class="image is-1by1">
                <img :src="post.coverImgUrl"/>
            </figure>
        </div>
        <div class="card-content">
            <h2 class="card-title">{{post.title}}</h2>
            <h6 class="card-date is-italic">Posted on:  {{ new Date(post.date).toLocaleString("en-gb", { dateStyle: "long" }) }}</h6>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ContentCard",
        props: ["post"],
        data() {
            return {
                hover1: false,
                hover2: false
            }
        },
        methods: {
            goToPost() {
                this.$router.push({name: 'ViewPost', params: {postId: this.post.postId}})
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
        min-height: 350px;
        transition: 0.3s ease all;
        cursor: pointer;

        &:hover {
            transform: rotateZ(-1deg) scale(1.03);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
    }
</style>
