<template>
    <div class="card" @click="goToCrew">
        <div :class="`card-header has-background-${['info', 'danger', 'success', 'primary'][crew.gender]}`">
<!--            <p class="is-italic date">{{['', 'Michaelmas', 'Lent', 'Easter'][crew.term]}}&nbsp;{{crew.year}}</p>-->
        </div>
        <div class="card-content">
            <h1 class="subtitle is-6">{{crew.name}}</h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CrewCard",
        props: ['crew'],
        methods: {
            goToCrew() {
                this.$router.push({name: 'ViewCrew', params: {crewId: this.crew.crewId}})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .card-header {
        min-height: 20px;
    }

    .card {
        transition: 0.3s ease all;
        cursor: pointer;

        &:hover {
            transform: rotateZ(-1deg) scale(1.03);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
    }

    .card-content {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .date {
        font-size: 14px;
        color:white;
        margin-left: 10px;
    }
</style>
