<script setup>
import { RouterLink, useRouter } from "vue-router";
import DarkmodeToggle from "./darkmodeToggle.vue";
import { defineEmits, onBeforeMount, ref, watch } from "vue";
import { auth } from "../../FireStore/store";
import Cookies from "universal-cookie";
import { signOut } from "@firebase/auth";
import { onClickOutside } from "@vueuse/core";
import { useLoginStore } from "../../stores/LogStore";
import { storeToRefs } from "pinia";

let emit = defineEmits(["darkToggle"]);
let cookie = new Cookies();
let router = useRouter();
let currentUser = ref("");
let toggle = ref(false);
let sideBar = ref(null);
let { login } = storeToRefs(useLoginStore());
let { setLogout } = useLoginStore();
function darkToggle() {
  emit("darkToggle");
}

function logOut() {
  signOut(auth)
    .then(() => {
      cookie.remove("currentUser");
    })
    .then(() => {
      localStorage.removeItem("likes");
      localStorage.removeItem("wishlist");
      localStorage.setItem("login", JSON.stringify(false));
    }).then(()=>{
      setLogout()
    })
    .then(() => {
      router.push({ name: "login" });
    });
}

onBeforeMount(() => {
  currentUser.value = cookie.get("currentUser");
  if (window.screen.width < 500) {
    toggle.value = false;
  }
});

function getAuth() {
  if (JSON.parse(localStorage.getItem("login")) == true || login.value) {
    return true;
  } else {
    return false;
  }
}

onClickOutside(sideBar, () => {
  toggle.value = false;
});
</script>
<template>
  <nav
    class="w-full z-30 bg-black/60 flex justify-center lg:justify-between p-3 lg:px-48 px-6 fixed top-0"
  >
    <div class="flex items-center lg:gap-5 gap-2">
      <router-link class="lg:block hidden" to="/"
        ><img src="../../assets/Img/TM.png" class="lg:w-20 w-16" alt="" />
      </router-link>
      <p class="lg:text-3xl text-white/90">
        <span class="text-pramiary font-semibold">T</span>rending

        <span class="text-pramiary font-semibold">M</span>ovies
      </p>
    </div>

    <div
      class="hidden lg:flex select-none flex-row justify-evenly bg-gray-200 transition-colors duration-500 dark:bg-fourth dark:lg:bg-transparent lg:bg-transparent w-3/4 lg:w-fit end-0 top-0 lg:h-auto h-screen lg:gap-10 items-center"
    >
      <div><DarkmodeToggle @darkToggle="darkToggle" /></div>

      <div class="lg:w-fit w-full flex flex-col items-center gap-10">
        <div
          v-if="getAuth()"
          class="flex flex-col items-center lg:flex-row text-black/60 lg:text-white dark:text-white/60 gap-4 text-xl"
        >
          <router-link
            class="hover:text-pramiary transition duration-200 hover:scale-105"
            to="/wishlist"
            >WishList</router-link
          >

          <router-link
            class="hover:text-pramiary transition duration-200 hover:scale-105"
            to="/likes"
            >favourites</router-link
          >

          <div
            @click="logOut"
            class="dark:text-pramiary text-fourth active:scale-95 hover:underline cursor-pointer"
          >
            Log Out
          </div>
        </div>

        <router-link class="lg:w-fit w-4/5" to="/login" v-else>
          <button
            class="bg-pramiary lg:w-fit w-full h-8 px-3 lg:text-lg rounded-md text-white"
          >
            Sign In
          </button>
        </router-link>
      </div>
    </div>

    <div class="lg:hidden block">
      <Transition name="fade">
        <div
          ref="sideBar"
          v-if="toggle"
          @dblclick.self="toggle = false"
          class="flex lg:hidden select-none flex-col-reverse lg:flex-row justify-evenly lg:relative fixed bg-gray-200 transition-colors duration-500 dark:bg-fourth dark:lg:bg-transparent lg:bg-transparent w-3/4 lg:w-fit end-0 top-0 lg:h-auto h-screen lg:gap-10 items-center z-50 lg:items-center"
        >
          <div><DarkmodeToggle @darkToggle="darkToggle" /></div>

          <div class="lg:w-fit w-full flex flex-col items-center gap-10">
            <router-link class="block lg:hidden" to="/"
              ><img
                src="../../assets/Img/TM.png"
                class="w-32"
                alt=""
                @click="toggle = false"
              />
            </router-link>

            <div
              v-if="getAuth()"
              class="flex flex-col items-center lg:flex-row text-black/60 lg:text-white dark:text-white/60 gap-4 text-xl"
            >
              <router-link
                class="hover:text-pramiary transition duration-200 hover:scale-105"
                to="/wishlist"
                >WishList</router-link
              >

              <router-link
                class="hover:text-pramiary transition duration-200 hover:scale-105"
                to="/likes"
                >favourites</router-link
              >

              <div
                @click="logOut"
                class="dark:text-pramiary text-fourth active:scale-95 hover:underline cursor-pointer"
              >
                Log Out
              </div>
            </div>

            <router-link class="lg:w-fit w-4/5" to="/login" v-else>
              <button
                class="bg-pramiary lg:w-fit w-full h-8 px-3 lg:text-lg rounded-md text-white"
              >
                Sign In
              </button>
            </router-link>
          </div>
        </div>
      </Transition>

      <Transition name="fadeIn">
        <div
          v-if="toggle"
          class="bg-transparent transition fixed top-0 start-0 h-screen w-1/4"
        ></div>
      </Transition>
    </div>

    <img
      src="/src//assets/icons/bars-svgrepo-com.svg"
      class="w-9 block lg:hidden active:scale-95 absolute end-6 top-2"
      @click="toggle = true"
      alt=""
    />
  </nav>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(100%);
}

.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: 0.2s ease-in;
}

.fadeIn-enter-from,
.fadeIn-leave-to {
  opacity: 0;
}
</style>
