<template>
    <div class="form-wrap">
        <p class="return">
            <router-link :to="{name: 'Home'}">
                <b-icon icon="arrow-left"></b-icon>
                Return to home
            </router-link>
        </p>
        <form class="login">
            <h2 class="title">Create an account</h2>
            <div class="inputs">
                <b-field :type="formValid.forename">
                    <b-input @blur="forenameValid"
                             icon="account"
                             placeholder="First Name"
                             required
                             v-model="formData.forename"></b-input>
                </b-field>
                <b-field :type="formValid.surname">
                    <b-input @blur="surnameValid"
                             icon="account"
                             placeholder="Last Name"
                             required
                             v-model="formData.surname"></b-input>
                </b-field>
                <b-field :message="formValid.emailText" :type="formValid.email">
                    <b-input @blur="emailValid"
                             icon="email"
                             placeholder="Email (preferably .cam.ac.uk)"
                             required
                             type="email"
                             v-model="formData.email"
                             validation-message="Invalid email format"
                    ></b-input>
                </b-field>
                <b-field :message="formValid.confirmEmailText" :type="formValid.confirmEmail">
                    <b-input @blur="confirmEmailValid"
                             icon="email"
                             placeholder="Confirm Email"
                             required
                             v-model="formData.confirmEmail"
                    ></b-input>
                </b-field>
                <b-field :type="formValid.password">
                    <b-input @blur="passwordValid"
                             icon="lock"
                             minlength="6"
                             placeholder="Password"
                             required
                             type="password"
                             v-model="formData.password"
                             validation-message="Password must be at least 6 characters long"
                    >
                    </b-input>
                </b-field>
                <b-field :message="formValid.confirmPasswordText" :type="formValid.confirmPassword">
                    <b-input @blur="confirmPasswordValid"
                             icon="lock"
                             placeholder="Confirm password"
                             type="password"
                             v-model="formData.confirmPassword">
                    </b-input>
                </b-field>
            </div>
            <b-button @click.prevent="signUp" class="login" icon-right="arrow-right" type="is-info">Register</b-button>
            <hr class="rule">
            <p class="login-register">
                Already have an account?
                <router-link :to="{ name: 'Login' }" class="router-link">Log In</router-link>
            </p>

            <div class="angle"></div>
        </form>
        <div class="background">
            <vue-particles class="particles"></vue-particles>
        </div>
    </div>
</template>

<script>
    import firebase from "firebase/app"
    import "firebase/auth"
    import db from "../firebase/firebaseInit"

    export default {
        name: "Register",
        data() {
            return {
                formData: {
                    forename: '',
                    surname: '',
                    email: '',
                    confirmEmail: '',
                    password: '',
                    confirmPassword: '',
                },
                formValid: {
                    forename: '',
                    surname: '',
                    email: '',
                    emailText: '',
                    confirmEmail: '',
                    confirmEmailText: '',
                    password: '',
                    confirmPassword: '',
                    confirmPasswordText: ''
                },
            }
        },
        methods: {
            forenameValid() {
                this.formValid.forename = this.formData.forename.length > 0 ? 'is-success' : 'is-danger'
                return this.formData.forename.length > 0
            },
            surnameValid() {
                this.formValid.surname = this.formData.surname.length > 0 ? 'is-success' : 'is-danger'
                return this.formData.surname.length > 0
            },
            async emailValid() {
                firebase.auth().fetchSignInMethodsForEmail(this.formData.email).then(result => {
                    if (result.length === 0) {
                        this.formValid.email = 'is-success'
                        this.formValid.emailText = ''
                        return true
                    } else {
                        console.log(result)
                        this.formValid.email = 'is-danger'
                        this.formValid.emailText = 'An account already exists using this email. Try logging in'
                        return false
                    }
                }).catch(() => {
                    this.formValid.email = 'is-danger'
                    this.formValid.emailText = 'Invalid email format'
                    return false
                })
            },
            passwordValid() {
                this.formValid.password = this.formData.password.length >= 6 ? 'is-success' : 'is-danger'
                return this.formData.password.length >= 6
            },
            confirmEmailValid() {
                if (this.formValid.email === 'is-success') {
                    this.formValid.confirmEmail = this.formData.email === this.formData.confirmEmail ? 'is-success' : 'is-danger'
                    this.formValid.confirmEmailText = this.formData.email === this.formData.confirmEmail ? '' : 'Emails do not match'
                    return this.formData.email === this.formData.confirmEmail
                } else {
                    this.formValid.confirmEmail = ''
                    this.formValid.confirmEmailText = ''
                    return false
                }
            },
            confirmPasswordValid() {
                if (this.formData.password.length >= 6) {
                    this.formValid.confirmPassword = this.formData.password === this.formData.confirmPassword ? 'is-success' : 'is-danger'
                    this.formValid.confirmPasswordText = this.formData.password === this.formData.confirmPassword ? '' : 'Passwords do not match'
                    return this.formData.password === this.formData.confirmPassword
                } else {
                    this.formValid.confirmPassword = ''
                    this.formValid.confirmPasswordText = ''
                }
            },
            async signUp() {
                this.forenameValid()
                this.surnameValid()
                await this.emailValid()
                this.confirmEmailValid()
                this.passwordValid()
                this.confirmPasswordValid()
                if (this.forenameValid() && this.surnameValid() && this.formValid.email === 'is-success' && this.confirmEmailValid() && this.passwordValid() && this.confirmPasswordValid()) {
                    const fbAuth = await firebase.auth()
                    fbAuth.createUserWithEmailAndPassword(this.formData.email, this.formData.password).then(async (result) => {
                        const users_db = db.collection('users').doc(result.user.uid)
                        let forename = this.formData.forename.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.substring(1)).join(' ')
                        let surname = this.formData.surname.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.substring(1)).join(' ')
                        users_db.set({
                            forename: forename,
                            surname: surname,
                            email: this.formData.email,
                            created: Date.now(),
                            last_access: Date.now(),
                            bio: '',
                            height_cm: 0,
                            photo: null
                        }).then(()=> {
                            this.$router.push({name: 'Home'})
                        })
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
