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
    profileInitials: '',
    editor: {
      postTitle: '',
      postHTML: '',
    },
    loadedCards: [],
    editMode: false,
    pageLoaded: true
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
    setProfileInitials(state) {
      state.profileInitials =
          state.profile.forename.match(/(\b\S)?/g).join("") + state.profile.surname.match(/(\b\S)?/g).join("");
    },
    updatePostTitle(state, payload) {
      state.editor.postTitle = payload
    },
    updatePostHTML(state, payload) {
      state.editor.postHTML = payload
    },
    updatePostCoverImgUrl(state,payload) {
      state.editor.postCoverImgUrl = payload
    }
  },
  actions: {
    async getUserProfile({ commit }, user) {
      const record = await db.collection('users').doc(firebase.auth().currentUser.uid)
      const results = await record.get()
      commit('updateProfile', results.data())
      commit('setProfileInitials')
      const authToken = await user.getIdTokenResult()
      const isAdmin = await authToken.claims.admin
      commit('updateAdmin', isAdmin)
    },
    async getCards({ state }) {
      const dataBase = await db.collection("posts").orderBy("date", "desc")
      const dbResults = await dataBase.get();
      dbResults.forEach((doc) => {
        if (!state.loadedCards.some((post) => post.postId === doc.id)) {
          const data = {
            postId: doc.data().postId,
            coverImgUrl: doc.data().coverImgUrl,
            title: doc.data().title,
            date: doc.data().date,
            author: doc.data().author
          };
          state.loadedCards.push(data);
        }
      });
    }
  },
  modules: {
  },
  getters: {
    userFullName(state) {
      if (state.profile === null) {return ''}
      return state.profile.forename + ' ' + state.profile.surname
    },
    userEmail(state) {
      if (state.profile === null) {return ''}
      return state.profile.email
    }
  }
})
