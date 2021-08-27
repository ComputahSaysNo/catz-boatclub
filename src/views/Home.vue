<template>
  <div class="home">
    <section class="hero is-medium has-bg-img" >
      <div class="hero-body">
        <div class="container">
          <div class="title-bg p-4">
            <h1 class="title main-title has-text-light">
              St. Catharine's College Boat Club
            </h1>
             <h2 class="subtitle has-text-warning is-uppercase">founded 1883</h2>
          </div>
        </div>
      </div>
    </section>
    <section class="section has-background-white">
      <div class="container">
        <h1 class="has-text-centered title">Welcome</h1>
        <p class="info">We are SCCBC, the Boat Club of St. Catharine's College, Cambridge. Any student, novice or experienced, is welcome to row with us - to find out more, click here!</p>
      </div>
    </section>
    <div class="content-card-wrap">
      <div class="container">
        <h1 class="cards-title">Latest News:</h1>
        <div class="content-cards" v-if="getCardsPreview">
          <ContentCard :post="post" v-for="(post, index) in this.cardsPreview" :key="index"></ContentCard>
        </div>
      </div>
    </div>
    <div class="container e">
      <b-button type="is-danger" class="news-link" icon-right="arrow-right" tag="router-link" :to="{name: 'News'}">view all news</b-button>
    </div>
  </div>
</template>

<script>
  import ContentCard from "../components/ContentCard";

  export default {
    data(){
      return {
        cardsPreview: []
      }
    },
    methods: {
      getCardsPreview() {
        const numCards = Math.min(Math.floor(window.innerWidth / 240), 5)
        console.log(numCards, this.$store.state.loadedCards.length)
        this.cardsPreview = this.$store.state.loadedCards.slice(0, numCards)
      }
    },
    components: {
      ContentCard
    },
    mounted() {
      window.addEventListener("resize", this.getCardsPreview)
      this.$store.dispatch("getCards").then(()=> {
        this.getCardsPreview()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .has-bg-img {
    background: url('../assets/hero.jpg')center center; background-size:cover;
  }
  .title-bg {
    background-color: rgba(30, 30, 30, 0.9);
    display: inline-block;
    border-radius: 10px;
  }

  .main-title {
    font-size: 50px;
  }

  .info {
    font-size: 18px;
    text-align: center;
  }

  .cards-title {
    font-size: 25px;
    margin-bottom: 15px;
  }

  .news-link {
    width: 300px;
    margin-bottom: 20px;
  }

  .e {
    text-align: center;
  }

</style>
