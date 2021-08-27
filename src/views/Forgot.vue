<template>
    <div class="form-wrap">
        <p class="return">
            <router-link :to="{name: 'Home'}">
                <b-icon icon="arrow-left"></b-icon>
                Return to home
            </router-link>
        </p>
        <form class="login">
            <h2 class="title">Reset Password</h2>
            <p class="mb-4 mt-0 has-text-centered">Enter the account email below and we'll send it a reset link:</p>
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
            </div>
            <b-button @click.prevent="resetPassword" class="login" icon-right="arrow-right" type="is-info">Reset
                Password
            </b-button>
            <p class="error" v-show="error">{{errorMsg}}</p>
            <hr class="rule">
            <p class="login-register">
                Back to
                <router-link :to="{ name: 'Login' }" class="router-link">Log In</router-link>
            </p>
            <div class="angle"></div>
        </form>
        <b-modal :width="350" can-cancel="false" class="has-text-centered" v-model="modalActive">
            <div class="card p-3">
                <div class="card-image has-text-centered">
                    <b-icon icon="check-circle"
                            size="is-large"
                            type="is-success"
                    ></b-icon>
                </div>
                <div class="card-content">
                    <p>We've sent a reset link to {{email}}. <br>
                        Check your email!</p>
                    <b-button :to="{name: 'Login'}" class="mt-5" tag="router-link" type="is-info">Go to Login</b-button>
                </div>
            </div>
        </b-modal>
        <div class="background">
            <vue-particles class="particles"></vue-particles>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase/app'
    import 'firebase/auth'

    export default {
        name: "Forgot",
        data() {
            return {
                modalActive: false,
                email: '',
                errorMsg: '',
                error: false
            }
        },
        methods: {
            resetPassword() {
                if (this.email === '') {
                    this.error = true
                    this.errorMsg = 'Please enter an email'
                    return
                }
                firebase.auth().sendPasswordResetEmail(this.email).then(() => {
                    this.modalActive = true
                }).catch((err) => {
                    this.error = true
                    switch (err.code) {
                        case 'auth/invalid-email':
                            this.errorMsg = 'Invalid email format';
                            break
                        case 'auth/user-not-found':
                            this.errorMsg = 'We couldn\'t find an account matching this email'
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
