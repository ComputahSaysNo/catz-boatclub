<template>
    <footer>
        <div class="container">
            <div class="left">
                <div class="col-1">
                    <router-link :to="{ name: 'Home' }" class="header">SCCBC</router-link>
                    <h2 class="mb-2">Connect with us:</h2>
                    <ul>
                        <li>
                            <a href="https://www.instagram.com/stcatharinesboatclub/">
                                <b-icon icon="instagram" type="is-danger"></b-icon>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/SCCBC_Cam">
                                <b-icon icon="twitter" type="is-danger"></b-icon>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/sccbc.cam">
                                <b-icon icon="facebook" type="is-danger"></b-icon>
                            </a>
                        </li>
                        <li>
                            <a href="https://en.wikipedia.org/wiki/St_Catharine%27s_College_Boat_Club_(Cambridge)">
                                <b-icon icon="wikipedia" type="is-danger"></b-icon>
                            </a>
                        </li>
                    </ul>
                </div>
<!--                <div class="col-2">-->
<!--                    <ul>-->
<!--                        <router-link :to="{ name: 'Home' }" class="link">Home</router-link>-->
<!--                    </ul>-->
<!--                </div>-->
            </div>
            <div class="right is-italic">
                <p>&copy; 2021, Kevin Mathew</p>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "Footer",
        methods: {
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    footer {
        bottom: 100%;
        padding: 50px 25px;
        background-color: #303030;

        .container {
            display: flex;
            flex-direction: column;
            gap: 32px;
            @media (min-width: 800px) {
                flex-direction: row;
                gap: 0px;
            }

            > div {
                display: flex;
                flex: 1;
            }

            .left {
                gap: 32px;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                @media (min-width: 800px) {
                    flex-direction: row;
                    align-items: initial;
                    gap: 0;
                }

                .header {
                    text-align: center;
                    font-size: 24px;
                    color: #fff;
                    margin-bottom: 16px;
                    text-decoration: none;
                    font-weight: 600;
                    @media (min-width: 800px) {
                        text-align: initial;
                    }
                }

                ul {
                    gap: 16px;
                    list-style: none;
                    display: flex;
                }

                .col-1,
                .col-2 {
                    gap: 32px;
                    display: flex;
                    flex: 1;
                    @media (min-width: 800px) {
                        gap: 0;
                    }
                }

                .col-1 {
                    flex-direction: column;

                    h2 {
                        text-align: center;
                        @media (min-width: 800px) {
                            text-align: initial;
                        }
                    }

                    ul {
                        margin-top: auto;

                        li {
                            display: flex;
                            align-items: center;

                            .svg-icon {
                                width: 24px;
                                height: auto;
                                color: #fff;
                            }
                        }
                    }
                }

                .col-2 {
                    ul {
                        height: 100%;
                        justify-content: center;
                        flex-direction: row;
                        flex-wrap: wrap;
                        @media (min-width: 800px) {
                            flex-direction: column;
                        }

                        .link {
                            font-size: 16px;
                            font-weight: 500;
                            color: #fff;
                            text-decoration: none;
                        }
                    }
                }
            }

            .right {
                gap: 32px;
                color: #fff;
                align-items: center;
                flex-direction: column;
                @media (min-width: 800px) {
                    align-items: flex-end;
                    gap: 0;
                }
            }

            p {
                margin-top: auto;
            }
        }
    }
</style>
