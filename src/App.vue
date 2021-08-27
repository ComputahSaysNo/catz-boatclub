<template>
  <div id="app" v-show="$store.state.pageLoaded">
    <Navigation v-show="showNav"></Navigation>
    <body>
      <router-view/>
    </body>

    <div class="spacer"></div>
    <Footer v-show="showNav"></Footer>
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,700;1,400;1,700&display=swap');


  * {
    box-sizing: border-box;
    font-family: Barlow,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .spacer {
    flex: 1;
  }

  h1, h2, h3, .header {
    font-family: Roboto Slab, serif;
  }

  p {
    font-family: Barlow, sans-serif;
    font-size: 18px;
  }

  .link {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .icon {
    height: 1.5em;
    width: auto;
  }

  #app, body{
    display: flex;
    flex-direction: column;
    min-height: 63vh;
    background-color: #f1f1f1;
  }

  .content-card-wrap {
    position: relative;
    padding: 20px;

    .content-cards {
      display: grid;
      gap: 32px;
      grid-template-columns: 1fr;
      @media (min-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (min-width: 720px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (min-width: 960px) {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (min-width: 1200px) {
        grid-template-columns: repeat(5, 1fr);
      }
    }
  }

</style>
<script>
  import Navigation from "./components/Navigation";
  import Footer from "./components/Footer";
  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default {
    components: {Navigation, Footer},
    methods: {
      checkNav() {
        this.showNav = !(this.$route.name === "Login" || this.$route.name === "Register" || this.$route.name === "Forgot");
      }
    },
    data () {
      return {
        showNav: true
      }
    },
    created() {
      this.checkNav()
      firebase.auth().onAuthStateChanged((user) => {
        this.$store.commit('updateAuthUser', user)
        if (user) {
          this.$store.dispatch('getUserProfile', user)
        }
      })
      this.$store.dispatch("getCards")
    },
    mounted() {
    },
    watch: {
      $route() {
        this.checkNav()
      }
    }
  }
</script>
