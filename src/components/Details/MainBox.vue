<script setup>
import { defineEmits, defineProps, onMounted, reactive, ref } from "vue";
import GetData from "../../hooks/GetData";
import Wishlist from "./Wishlist.vue";
import GetRate from "../../hooks/GetRate";
import { watch } from "vue";
import GetVideo from "../../hooks/GetVideo";
import CastSlider from "./CastSlider.vue";
import { db } from "../../FireStore/store";
import Cookie from "universal-cookie";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

//variables
let route = useRoute();
let router = useRouter();
let cookie = new Cookie();
let currentUser = cookie.get("currentUser");
// let { type, id } = defineProps(["type", "id"]);
let { content, getData } = GetData();
let { rate, getRate } = GetRate();
let { videoKey, getVideo } = GetVideo();
let emit = defineEmits(["stopLoading"]);
let arrow = `<svg class="dark:fill-white fill-fourth transition-colors duration-500 w-3" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;
let star = `<svg class="w-8" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffd57a}</style><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
let heart = `<svg xmlns="http://www.w3.org/2000/svg" id="heart" :class="" class="fill-white cursor-pointer hover:fill-pramiary transitions-colors duration-200" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
let heartPramiary = `<svg xmlns="http://www.w3.org/2000/svg" id="heart" :class="" class="fill-pramiary cursor-pointer hover:fill-pramiary transitions-colors duration-200" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
let heartColor = ref("");
let rerender = ref(true);
let data = reactive({
  country: null,
  production: null,
  language: null,
});
let id = route.params.id;

//functions
onMounted(() => {
  getData(
    `https://api.themoviedb.org/3/${route.params.type}/${route.params.id}`
  );
  getVideo(`
https://api.themoviedb.org/3/${route.params.type}/${route.params.id}/videos
`);
});

onBeforeRouteUpdate(() => {
  setTimeout(() => {
    getData(
      `https://api.themoviedb.org/3/${route.params.type}/${route.params.id}`
    );
    getVideo(`
https://api.themoviedb.org/3/${route.params.type}/${route.params.id}/videos
`);
    rerender.value = false;
  }, 0);

  setTimeout(() => {
    rerender.value = true;
  }, 1);
  console.log("update");
});

watch(content, () => {
  getRate(content.value.imdb_id);
});

watch(content, () => {
  emit("stopLoading", false);
});

onMounted(() => {
  heartStyle();
});

watch(content, () => {
  data.production = content.value.production_companies[0].name;
  data.language = content.value.spoken_languages[0].english_name;
  data.country = content.value.production_countries[0].name;
});

function loading(e) {
  emit("stopLoading", e);
}

async function getDataFireStore() {
  let q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let Data = doc.data();
    localStorage.setItem("wishlist", JSON.stringify(Data.wishlist));
    localStorage.setItem("likes", JSON.stringify(Data.likes));
  });
  emit("stopLoading", false);
  heartColor.value = !heartColor.value;
}

async function handleLike() {
  let likes = localStorage.getItem("likes");
  likes = JSON.parse(likes);

  if (currentUser) {
    emit("stopLoading", true);
    let likedRef = doc(db, "users", currentUser.uid);
    if (likes.some((item) => item.id === route.params.id)) {
      let list = likes.filter((like) => like.id == route.params.id)[0];
      console.log(list);
      await updateDoc(likedRef, {
        likes: arrayRemove(list),
      });
      getDataFireStore();
    } else {
      await updateDoc(likedRef, {
        likes: arrayUnion({
          id: route.params.id,
          type: route.params.type,
        }),
      }).then(() => getDataFireStore());
    }
  } else {
    router.push("/login");
  }
}

function heartStyle() {
  let likes = [];
  likes = localStorage.getItem("likes");
  likes = JSON.parse(likes);
  if (likes) {
    if (likes.some((item) => item.id === route.params.id)) {
      heartColor.value = true;
    } else {
      heartColor.value = false;
    }
  }
}
</script>

<template>
  <div class="w-full flex lg:flex-row flex-col gap-6">
    <div v-if="rate" class="lg:w-[45%] w-[95%] mx-auto flex flex-col gap-4">
      <div
        class="w-full flex gap-1 transition-colors duration-500 items-center rounded-md overflow-hidden dark:bg-fourth bg-white shadow-slate-400 dark:shadow-black/50 shadow-lg dark:text-white p-1 px-4 lg:text-lg"
      >
        <p class="whitespace-nowrap lg:w-fit t">Tranding Movie</p>

        <p v-html="arrow"></p>

        <p>{{ route.params.type }}</p>

        <p v-html="arrow"></p>

        <p class="truncate">{{ content.title || content.name }}</p>
      </div>

      <div class="w-full flex lg:flex-row flex-col gap-4">
        <div class="lg:w-1/2 relative">
          <img
            :src="'https://image.tmdb.org/t/p/original' + content.poster_path"
            class="w-full"
            alt=""
          />
          <span
            v-if="heartColor"
            @click="handleLike"
            v-html="heartPramiary"
            class="active:scale-95 text-4xl absolute top-4 end-4"
          ></span>

          <span
            v-else
            @click="handleLike"
            v-html="heart"
            class="active:scale-95 text-4xl absolute top-4 end-4"
          ></span>
        </div>

        <div
          class="bg-white lg:w-1/2 flex flex-col gap-4 justify-between items-center rounded-md overflow-hidden shadow-slate-400 dark:shadow-black/50 shadow-lg dark:text-white transition-colors duration-500 dark:bg-fourth p-4"
        >
          <div class="flex flex-col gap-2 w-full">
            <div class="flex flex-col gap-2 w-full">
              <div class="flex flex-col w-full gap-2">
                <p class="text-xl font-semibold text-pramiary truncate w-full">
                  {{ content.title || content.name }}
                </p>
              </div>

              <p class="max-h-[21rem] overflow-clip">{{ content.overview }}</p>
            </div>

            <div class="py-2 rounded-md flex justify-between items-center">
              <span
                class="bg-secondary p-1 rounded-lg font-semibold text-lg text-black"
                >IMDb</span
              >

              <p class="text-2xl flex gap-[2px] items-center">
                {{ rate.rating }}<span class="text-sm"></span>

                <span v-html="star"></span>
              </p>
            </div>

            <div class="flex flex-wrap gap-2 w-full">
              <div
                class="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
                v-for="item in content.genres"
              >
                {{ item.name }}
              </div>
            </div>
          </div>

          <div class="w-full">
            <a
              v-if="videoKey"
              class=""
              target="_blank"
              :href="'https://www.youtube.com/watch?v=' + videoKey"
              ><button
                class="w-full bg-pramiary active:scale-95 cursor-pointer text-white p-2 rounded-lg font-semibold mx-auto"
              >
                Watch Trailar
              </button></a
            >
            <button
              disabled
              v-else
              class="w-full bg-gray-600 cursor-pointer text-white p-2 rounded-lg font-semibold mx-auto"
            >
              Watch Trailar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:w-[40%] w-[95%] flex flex-col gap-4" v-else>
      <div class="w-full rounded-lg bg-gray-600 animate-pulse h-9"></div>
      <div class="flex flex-col h-[34rem] gap-4 lg:flex-row">
        <div class="lg:w-1/2 h-full bg-gray-600 animate-pulse"></div>
        <div class="lg:w-1/2 h-full rounded-lg bg-gray-600 animate-pulse"></div>
      </div>
    </div>

    <div class="lg:w-[55%] w-[95%] mx-auto flex flex-col">
      <div class="w-full flex lg:flex-row flex-col">
        <Wishlist v-if="rerender" :content="content" @loading="loading" />

        <div
          class="w-full flex flex-col lg:flex-row flex-wrap justify-evenly items-start h-fit gap-4 py-4 dark:text-white"
        >
          <div
            class="flex gap-[1px] flex-col w-full h-fit lg:w-[45%] bg-pramiary rounded-t-md text-center"
          >
            <div class="p-2 text-white">Date</div>
            <span class="p-2 dark:bg-fourth bg-white">{{
              content.release_date || "Unknown"
            }}</span>
          </div>

          <div
            class="flex gap-[1px] flex-col w-full h-fit lg:w-[45%] bg-pramiary rounded-t-md text-center"
          >
            <div class="p-2 text-white">Language</div>
            <span class="p-2 dark:bg-fourth bg-white">{{
              data.language || "Unknown"
            }}</span>
          </div>

          <div
            class="flex gap-[1px] flex-col w-full h-fit lg:w-[45%] bg-pramiary rounded-t-md text-center"
          >
            <div class="p-2 text-white">Country</div>
            <span v-if="content" class="p-2 dark:bg-fourth bg-white">{{
              data.country || "Unknown"
            }}</span>
          </div>

          <div
            class="flex gap-[1px] flex-col w-full h-fit lg:w-[45%] bg-pramiary rounded-t-md text-center"
          >
            <div class="p-2 text-white">Production Companies</div>
            <span class="p-2 dark:bg-fourth bg-white">{{
              data.production || "Unknown"
            }}</span>
          </div>

          <div
            v-if="route.params.type === 'tv'"
            class="flex gap-[1px] flex-col w-full h-fit lg:w-[45%] bg-pramiary rounded-t-md text-center"
          >
            <div class="p-2 text-white">Seasons</div>
            <span class="p-2 dark:bg-fourth bg-white">{{
              content.number_of_seasons || "Unknown"
            }}</span>
          </div>

          <div
            v-if="route.params.type === 'tv'"
            class="flex gap-[1px] flex-col w-full h-fit lg:w-[45%] bg-pramiary rounded-t-md text-center"
          >
            <div class="p-2 text-white">Episodes</div>
            <span class="p-2 dark:bg-fourth bg-white">{{
              content.number_of_episodes || "Unknown"
            }}</span>
          </div>
        </div>
      </div>
      <CastSlider />
    </div>
  </div>
</template>

<style scoped></style>
