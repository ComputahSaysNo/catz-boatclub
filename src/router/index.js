import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import News from '../views/News.vue'
import Login from "../views/Login";
import Register from "../views/Register";
import Forgot from "../views/Forgot";
import ViewPost from "../views/ViewPost";
import CreatePost from "../views/CreatePost";
import Info from "../views/Info";
import Profile from "../views/Profile";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: "Home"
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: "About"
    },

  },
  {
    path: '/news',
    name: 'News',
    component: News,
    meta: {
      title: "News"
    },
  },
  {
    path: '/news/:postId',
    name: 'ViewPost',
    component: ViewPost,
    meta: {
      title: "News"
    }
  },
  {
    path: '/info',
    redirect: '/info/main'
  },
  {
    path: '/info/:infoId',
    name: 'Info',
    component: Info,
    meta: {
      title: "Info"
    }

  },

  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost,
    meta: {
      title: "Create Post"
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: "Login"
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: "Register"
    },
  },
  {
    path: '/forgot-password',
    name: 'Forgot',
    component: Forgot,
    meta: {
      title: "Forgot Password"
    },
  },
  {
    path: '/profile/:uid',
    name: 'Profile',
    component: Profile,
    meta: {
      title: `User Profile`
    },

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | SCCBC`;
  next();
});

export default router
