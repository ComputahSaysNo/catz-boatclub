<template>
    <div class="form-wrap">
        <p class="return">
            <router-link :to="{name: 'Home'}">
                <b-icon icon="arrow-left"></b-icon>
                Return to home
            </router-link>
        </p>

        <form class="login">
            <h2 class="title">Login to SCCBC</h2>
            <div class="inputs">
                <b-field>
                    <b-input @input="error=false"
                             icon="email"
                             placeholder="Email"
                             type="email"
                             v-model="email"
                             validation-message=" "
                    ></b-input>
                </b-field>
                <b-field>
                    <b-input @input="error=false"
                             icon="lock"
                             placeholder="Password"
                             type="password"
                             v-model="password">
                    </b-input>
                </b-field>
            </div>
            <b-button @click.prevent="loginEmailPassword" class="login" icon-right="arrow-right" type="is-info">Log In
            </b-button>
            <p class="error" v-show="error">{{errorMsg}}</p>
            <router-link :to="{name: 'Forgot'}" class="forgot-password">forgot password?</router-link>
            <hr class="rule">
            <p class="login-register">
                Don't have an account?
                <router-link :to="{ name: 'Register' }" class="router-link">Sign Up</router-link>
            </p>

            <div class="angle"></div>
        </form>
        <div class="background">
            <vue-particles class="particles"></vue-particles>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase/app'
    import 'firebase/auth'

    export default {
        name: "Login",
        data() {
            return {
                email: '',
                password: '',
                errorMsg: 'Something went wrong',
                error: false,
            }
        },
        methods: {
            loginEmailPassword() {
                if (this.email === '') {
                    this.error = true
                    this.errorMsg = 'Missing email and/or password'
                    return
                }
                firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
                    this.$router.push({name: 'Home'})
                    this.error = false
                }).catch((err) => {
                    this.error = true
                    switch (err.code) {
                        case 'auth/user-not-found':
                            this.errorMsg = 'User not found. Have you made an account?'; break
                        case 'auth/wrong-password':
                            this.errorMsg = 'Incorrect password'; break
                        case 'auth/invalid-email':
                            this.errorMsg = 'Invalid email format'; break
                        default:
                            this.errorMsg = "Something went wrong"
                            console.log(err.message())
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .migration {
        width: 300px;
    }

    .form-wrap {
        overflow: hidden;
        display: flex;
        height: 100vh;
        justify-content: center;
        align-self: center;
        margin: 0 auto;
        width: 90%;
        @media (min-width: 900px) {
            width: 100%;
        }

        .return {
            font-size: 18px;
            position: absolute;
            left: 3vh;
            top: 3vh;
            z-index: 10;
        }

        form {
            padding: 0 10px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 1;
            @media (min-width: 900px) {
                padding: 0 50px;
            }

            h2 {
                text-align: center;
                font-size: 32px;
                color: #303030;
                margin-bottom: 40px;
                @media (min-width: 900px) {
                    font-size: 40px;
                }
            }

            .inputs {
                width: 100%;
                max-width: 300px;

                .input {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 0px;
                    font-size: 15px;

                    .icon {
                        width: 12px;
                        position: absolute;
                        left: 6px;
                    }
                }
            }

            .forgot-password {
                text-decoration: none;
                color: #000;
                cursor: pointer;
                font-size: 14px;
                margin: 16px 0 0;
                border-bottom: 1px solid transparent;
                transition: 0.5s ease all;

                &:hover {
                    border-color: #303030;
                }
            }

            .login {
                margin-top: 12px;
                width: 300px;
                font-size: 16px;
            }

            .angle {
                display: none;
                position: absolute;
                background-color: #ffe221;
                transform: rotateZ(3deg);
                width: 70px;
                right: -35px;
                height: 101%;
                @media (min-width: 1100px) {
                    display: initial;
                }
            }

            .error {
                font-size: 14px;
                margin-top: 10px;
                color: #ff0018;
                border-top: 1px solid red;
                border-bottom: 1px solid red;
                padding: 3px;
                width: 100%;
                max-width: 300px;
                text-align: center;
            }

            .login-register {
                font-size: 16px;

                .router-link {
                    color: #dc3545;
                }
            }

            .rule {
                width: 100%;
                max-width: 300px;
                margin-top: 30px;
            }
        }

        .background {
            display: none;
            flex: 2;
            background-size: cover;
            width: 100%;
            height: 100%;
            @media (min-width: 1020px) {
                display: initial;
            }
            background-color: #dc3545;

            .particles {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
