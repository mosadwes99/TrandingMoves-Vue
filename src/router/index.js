import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import DetailsView from "../views/DetailsView.vue";
import SearchResultsView from "../views/SearchResultsView.vue";
import MainLayout from "../Layouts/MianLayout.vue";
import LikesView from "../views/LikesView.vue";
import WishlistView from "../views/WislistView.vue";
import Cookies from "universal-cookie";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "mainlayout",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "/details/:type/:id",
          name: "details",
          props: true,
          component: DetailsView,
        },
        {
          path: "/search/:id",
          name: "search",
          props: true,
          component: SearchResultsView,
        },
        {
          path: "/wishlist",
          name: "wishlist",
          component: WishlistView,
        },
        {
          path: "/likes",
          name: "likes",
          component: LikesView,
        },
      ],
    },

    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
  ],
});

router.beforeEach((to) => {
  let logedFromLocal = JSON.parse(localStorage.getItem("login"));
  console.log(logedFromLocal)
  if(logedFromLocal){
    if(to.path === "/login" || to.path === "/signup"){
      return "/"
    }
  }else{
    if(to.path === "/wishlist" || to.path === "/likes"){
      return "/login"
    }
  }
  // if ((to.name === "wishlist" || to.name === "likes") && logedFromLocal) {
  //   return to.path;
  // } else if (to.path === "/login" && logedFromLocal) {
  //   return "/";
  // }
});

export default router;
