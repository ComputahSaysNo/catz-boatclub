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
                <b-field :type="formValid.name">
                    <b-input @blur="nameValid"
                             icon="account"
                             placeholder="Full name"
                             required
                             v-model="formData.name"></b-input>
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
                             placeholder="Confirm email"
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
            <p class="privacy mt-2 is-italic">
                by clicking 'Register', you confirm that you agree to the <span class="link forgot-password has-text-danger" @click="privacyPopup=true">Privacy Policy</span>
            </p>
            <b-modal :width="350" v-model="privacyPopup">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-header-title">
                            Privacy Policy
                        </h1>
                    </div>
                    <div class="card-content">
                        Your email and full name, as well as any information you choose to disclose on your profile page, will be visible by other users of the site.
                    </div>
                </div>
            </b-modal>
            <hr class="rule mt-5">
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
    import "firebase/functions"

    export default {
        name: "Register",
        data() {
            return {
                formData: {
                    name: '',
                    email: '',
                    confirmEmail: '',
                    password: '',
                    confirmPassword: '',
                    privacyAccepted: false
                },
                formValid: {
                    name: '',
                    email: '',
                    emailText: '',
                    confirmEmail: '',
                    confirmEmailText: '',
                    password: '',
                    confirmPassword: '',
                    confirmPasswordText: ''
                },
                privacyPopup: false,
            }
        },
        methods: {
            nameValid() {
                this.formValid.name = this.formData.name.length > 0 ? 'is-success' : 'is-danger'
                return this.formData.name.length > 0
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
                this.nameValid()
                await this.emailValid()
                this.confirmEmailValid()
                this.passwordValid()
                this.confirmPasswordValid()
                if (this.nameValid() && this.formValid.email === 'is-success' && this.confirmEmailValid() && this.passwordValid() && this.confirmPasswordValid()) {
                    const loading = this.$buefy.loading.open()
                    let name = this.formData.name.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.substring(1)).join(' ')
                    console.log(name)
                    const fbAuth = await firebase.auth()
                    fbAuth.createUserWithEmailAndPassword(this.formData.email, this.formData.password).then(async (result) => {
                        const user = firebase.auth().currentUser
                        user.updateProfile({displayName: name}).then(async () => {
                                const createUserRecord = await firebase.app().functions('europe-west1').httpsCallable('createNewUserRecord')
                                createUserRecord({name: name, uid: result.user.uid, email: this.formData.email}).then(async (profile)=> {
                                    this.$store.commit('updateAuthUser', result.user)
                                    this.$store.commit('updateProfile', profile)
                                    loading.close()
                                    await this.$router.push({name: 'Home'})
                                    this.$buefy.toast.open({message: 'Account created! Head to your profile to finish setting it up', type: 'is-info', position: 'is-bottom'})
                                })

                        })
                    })
                }
            }
        }
    }
</script>

<style scoped>
.privacy {
    font-size: 14px;
    max-width: 500px;
    text-align: center;
}
</style>
