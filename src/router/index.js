import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import DetailsView from "../views/DetailsView.vue";
import TVDetailsView from "../views/TVDetailsView.vue";
import SearchResultsView from "../views/SearchResultsView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
  ],
});

export default router;
