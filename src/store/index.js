import Vue from 'vue'
import Vuex from 'vuex'
import db from '../firebase/firebaseInit'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authUser: null,
    profile: null,
    isAdmin: false,
    editor: {
      postTitle: '',
      postHTML: '',
      taggedCrews: []
    },
    loadedNewsCards: [],
    loadedCrewCards: [],
    editMode: false,
    pageLoaded: true,
    postsLoaded: false,
    mobile: false,
    counter: 0
  },
  mutations: {
    updateAuthUser(state, payload) {
      state.authUser = payload
    },
    updateProfile(state, payload) {
      state.profile = payload
    },
    updateAdmin(state, payload) {
      state.isAdmin = payload
    },
    updatePostTitle(state, payload) {
      state.editor.postTitle = payload
    },
    updatePostHTML(state, payload) {
      state.editor.postHTML = payload
    },
    updatePostCoverImgUrl(state,payload) {
      state.editor.postCoverImgUrl = payload
    },
    resetNewsCards(state) {
      state.loadedNewsCards = []
    }
  },
  actions: {
    async getUserProfile({ commit }, user) {
      const record = await db.collection('profiles').doc(firebase.auth().currentUser.uid)
      const results = await record.get()
      commit('updateProfile', results.data())
      const authToken = await user.getIdTokenResult()
      const isAdmin = await authToken.claims.admin
      commit('updateAdmin', isAdmin)
    },
    async getNewsCards({ state }, limit) {
      state.postsLoaded = false
      const dataBase = await db.collection("posts").orderBy("date", "desc").limit(limit)
      const dbResults = await dataBase.get();
      dbResults.forEach((doc) => {
        if (!state.loadedNewsCards.some((post) => post.postId === doc.id)) {
          state.loadedNewsCards.push(doc.data());
        }
      });
      state.postsLoaded = true
    },
    async getCrewCards({state}) {
      const dataBase = await db.collection("crews").orderBy("year", "desc")
      const dbResults = await dataBase.get()
      dbResults.forEach((doc) => {
        if (!state.loadedCrewCards.some((crew) => crew.crewId === doc.id)) {
          state.loadedCrewCards.push(doc.data())
        }
      })
    }
  },
  modules: {
  },
  getters: {
    email(state) {
      if (state.authUser === null) {return ''}
      return state.authUser.email
    },
    name(state) {
      if (state.authUser === null) {return ''}
      return state.authUser.displayName
    },

    initials(state) {
      if (state.authUser === null) {return ''}
      return state.authUser.displayName.match(/(\b\S)?/g).join("")
    },
    loadedNewsCards(state) {
      return state.loadedNewsCards
    }
  }
})
