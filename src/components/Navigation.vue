<template>
    <div class="navigation">
        <header>
            <nav class="container">
                <router-link :to="{name: 'Home'}" class="branding link">
                    <WheelIcon class="icon"/>
                    <h1 class="header">SCCBC</h1>
                </router-link>
                <div class="nav-links">
                    <ul v-show="!$store.state.mobile">
                        <router-link class="link" :to="{name: 'News'}">News</router-link>
                        <b-dropdown :triggers="['hover']" aria-role="list" class="link mr-4">
                            <template #trigger>
                                <router-link to="/info/main" class="link-dropdown">Info</router-link>
                                <b-icon icon="menu-down"></b-icon>
                            </template>
                            <router-link to="/info/applicants"><b-dropdown-item aria-role="listitem">Potential Applicants</b-dropdown-item></router-link>
                            <router-link to="/info/alumni"><b-dropdown-item aria-role="listitem">Alumni</b-dropdown-item></router-link>
                            <router-link to="/info/committee"><b-dropdown-item aria-role="listitem">Committee</b-dropdown-item></router-link>
                            <router-link to="/info/covid"><b-dropdown-item aria-role="listitem">COVID-19 Policy</b-dropdown-item></router-link>
                            <router-link to="/info/history"><b-dropdown-item aria-role="listitem">Club History</b-dropdown-item></router-link>

                        </b-dropdown>
                        <router-link class="link" :to="{name: 'Crews'}">Crews</router-link>
                        <router-link class="link" :to="{name: 'Outings' }">Outings</router-link>
                        <router-link class="link" :to="{name: 'Ergs' }">Ergs</router-link>
                        <router-link class="link" :to="{name: 'Gallery'}">Gallery</router-link>
                        <b-button :to="{name: 'Login' }" class="mr-3" tag="router-link" type="is-warning"
                                  v-show="!$store.state.authUser">
                            Login
                        </b-button>
                    </ul>
                    <ul v-if="$store.state.mobile">
                        <b-button :to="{name: 'Login' }" class="mr-3" tag="router-link" type="is-warning"
                                  v-show="!$store.state.authUser">
                            Login
                        </b-button>
                    </ul>
                    <div class="profile" v-if="$store.state.authUser">
                        <span class="initials" @click="profileMenuOpen=!profileMenuOpen"><h1>{{$store.getters.initials}}</h1></span>
                        <div class="profile-menu" v-show="profileMenuOpen">
                            <div class="close-profile" @click="profileMenuOpen=false">
                                <b-icon icon="close" class="close-profile"></b-icon>
                            </div>
                            <router-link :to="{name: 'Profile', params: {uid: $store.state.authUser.uid}}" class="initials ml-auto mr-auto mt-4"
                                 :style="'font-size: 23px; width: 70px; height: 70px;'"><h1>
                                {{$store.getters.initials}}</h1></router-link>
                            <h1 class="mt-4 mb-1">{{$store.getters.name}}</h1>
                            <h4 class="is-italic mb-2">{{$store.getters.email}}</h4>
                            <b-tag rounded type="is-danger" class="mr-1" v-show="$store.state.isAdmin">Admin</b-tag>
                            <hr :style="'border-top: 1px solid black'">
                            <router-link :to="{name: 'Profile', params: {uid: $store.state.authUser.uid}}"><b-button class="menu-btn mb-2" icon-right="account" type="is-primary">My Profile</b-button></router-link>
                            <router-link :to="{name: 'Admin'}">
                                <b-button class="menu-btn mb-2" icon-right="wrench" v-show="$store.state.isAdmin">Admin Panel</b-button>
                            </router-link>

                            <b-button type="is-danger" class=menu-btn icon-right="exit-to-app" @click="signOut">Log Out</b-button>
                        </div>
                    </div>
                    <div>
                        <MenuIcon @click="toggleMobileSidebar" class="icon mobile-menu-toggle" v-show="$store.state.mobile"/>
                    </div>
                </div>
            </nav>
        </header>
        <b-sidebar fullheight v-model="mobileNavOpen" v-if="$store.state.mobile">
            <b-menu>
                <h1>SCCBC</h1>
                <b-menu-list>
                    <b-menu-item icon="home" label="Home" tag="router-link" to="/"></b-menu-item>
                    <b-menu-item icon="newspaper-variant-multiple-outline" label="News" tag="router-link" to="/news"></b-menu-item>
                    <b-menu-item icon="information-outline">
                        <template #label="props">
                            Info
                            <b-icon :icon="props.expanded ? 'menu-down' : 'menu-up'" class="is-pulled-right">
                            </b-icon>
                        </template>

                        <b-menu-item icon="information-outline" label="Potential Applicants" tag="router-link" to="/info/applicants"></b-menu-item>
                        <b-menu-item icon="information-outline" label="Club History" tag="router-link" to="/info/history"></b-menu-item>
                        <b-menu-item icon="information-outline" label="Alumni" tag="router-link" to="/info/alumni"></b-menu-item>
                        <b-menu-item icon="information-outline" label="Committee" tag="router-link" to="/info/committee"></b-menu-item>
                        <b-menu-item icon="information-outline" label="COVID-19 Policy " tag="router-link" to="/info/covid"></b-menu-item>
                    </b-menu-item>
                    <b-menu-item icon="account-group" label="Crews" tag="router-link" to="/crews"></b-menu-item>
                    <b-menu-item icon="waves" label="Outings" tag="router-link" to="/outings"></b-menu-item>
                    <b-menu-item icon="image-filter-hdr" label="Ergs" tag="router-link" to="/ergs"></b-menu-item>
                    <b-menu-item icon="image" label="Gallery" tag="router-link" to="/gallery"></b-menu-item>
                </b-menu-list>
            </b-menu>
        </b-sidebar>
    </div>
</template>

<script>
    import MenuIcon from "../assets/icons/bars-regular.svg"
    import WheelIcon from "../assets/icons/catz-wheel.svg"
    import firebase from 'firebase/app'
    import 'firebase/auth'

    export default {
        name: "Navigation",
        components: {
            MenuIcon,
            WheelIcon
        },
        data() {
            return {
                mobileNavOpen: null,
                profileMenuOpen: false,
                windowWidth: null,
            }
        },
        methods: {
            toggleMobileSidebar() {
                this.mobileNavOpen = !this.mobileNavOpen
            },
            signOut() {
                firebase.auth().signOut();
                window.location.reload();
            }
        },
        watch: {
            $route() {
                this.profileMenuOpen = false
                this.mobileNavOpen = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navigation {
        position: sticky;
        top: 0;
        z-index: 30;
    }


    header {
        color: #fff;
        background-color: #dc3545;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 99;
        padding: 0 25px;
    }

    nav {
        color: #fff;
        display: flex;
        padding: 10px 0;

        .branding {
            display: flex;
            align-items: center;
            font-size: 30px;

            &:hover {
                color: #ffe221;
            }

            .icon {
                transition: transform 2s ease-in-out;

                &:hover {
                    transform: rotate(3600deg);
                    transition: transform 20s;
                }
            }

            .header {
                display: flex;
                margin-left: 0.1em;
                font-weight: 600;
            }
        }

        .nav-links {
            position: relative;
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: flex-end;

            ul {
                display: flex;
                align-items: center; /* align vertical */
                .link {
                    list-style-type: none;
                    float: left;
                    font-size: 20px;
                    margin-right: 25px;

                    &:hover {
                        color: #ffe221;
                    }
                }
                .link-dropdown {
                    list-style-type: none;
                    color: white;

                    &:hover {
                        color: #ffe221;
                    }
                }
            ;
            }

            .profile {
                .initials {
                    position: relative;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    border-radius: 50px;
                    color: #fff;
                    background-color: #303030;
                    margin-right: 15px;
                    z-index: 2;
                    transition: 0.2s;

                    &:hover {
                        transform: scale(1.1);
                    }
                }

                .profile-menu {
                    position: absolute;
                    top: 60px;
                    right: 0;
                    width: 250px;
                    background-color: #f1f1f1;
                    color: black;
                    text-align: center;
                    align-items: center;
                    align-content: center;
                    justify-content: center;
                    padding: 20px;
                    border: 1px solid black;

                    z-index: 99;
                    box-shadow: 0 10px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

                    .close-profile {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        cursor: pointer;
                    }
                }

                .menu-btn {
                    width: 100%;

                }
            }

        }

        .mobile-menu-toggle {
            margin-top: 4px;

            &:hover {
                cursor: pointer;
                color: #ffe221;
            }
        }
    }
</style>
