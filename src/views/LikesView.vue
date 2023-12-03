<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Loading from "../Sections/Loading.vue";

import { db } from "../FireStore/store";
import Cookie from "universal-cookie";
import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

let router = useRouter();
let cookie = new Cookie();
let currentUser = cookie.get("currentUser");
let content = ref([]);
let error = ref(null);
let isLoading = ref(true);
let heartPramiary = `<svg xmlns="http://www.w3.org/2000/svg" id="heart"  class="fill-pramiary text-3xl  cursor-pointer hover:fill-pramiary transitions-colors duration-200" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;

let options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjVlNmEwNzUwNThhOTczYWNkM2VjMjY2MzA5MDM3ZiIsInN1YiI6IjY1NjA0M2NkNzA2ZTU2MDBmZTAyMjI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2S9moB5B2zhnQ9sTeNghIaA9SE5qMy_6LEuuMImXnOI",
  },
};

async function getData() {
  content.value = [];
  isLoading.value = true;
  try {
    let likes = localStorage.getItem("likes");
    likes = JSON.parse(likes);
    if (likes.length) {
      let fetchDataPromises = likes.map(async (item) => {
        let response = await fetch(
          `https://api.themoviedb.org/3/${item.type}/${item.id}`,
          options
        );
        if (response.ok) {
          isLoading.value = false;
        }
        let itemData = await response.json();
        return itemData;
      });

      let itemsData = await Promise.all(fetchDataPromises);

      content.value = itemsData;
    } else {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
  } catch (err) {
    // Handle errors
    error.value = err;
  }
}

onMounted(() => {
  getData();
});

function route(e) {
  let likes = localStorage.getItem("likes");
  likes = JSON.parse(likes);
  likes = likes.filter((item) => item.id == e.id);
  console.log(likes);
  router.push({
    name: "details",
    params: { id: e.id, type: likes[0].type },
  });
}

async function handlelike(item) {
  isLoading.value = true;
  let likes = localStorage.getItem("likes");
  likes = JSON.parse(likes);
  let likedRef = doc(db, "users", currentUser.uid);

  let list = likes.filter((like) => like.id == item.id)[0];
  await updateDoc(likedRef, {
    likes: arrayRemove(list),
  });
  await getDataFireStore();
}

async function getDataFireStore() {
  let q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let Data = doc.data();
    localStorage.setItem("likes", JSON.stringify(Data.likes));
  });
  await getData();
}
</script>

<template>
  <div class="w-full">
    <div class="pt-28 flex flex-col min-h-screen w-[80%] mx-auto">
      <div v-if="!content.length && !isLoading">
        <p class="text-pramiary lg:text-3xl font-bold w-full">
          Likes list is empty:
        </p>
      </div>

      <div class="w-full grid lg:grid-cols-6 grid-cols-1 gap-3">
        <div
          :key="item.id"
          v-if="content.length !== 0"
          v-for="item in content"
          class="col-span-1 row-span-2 lg:row-span-1 relative rounded-lg overflow-hidden group"
        >
          <div class="overflow-hidden ">
            <img
              @click="route(item)"
              class="object-cover cursor-pointer group-hover:scale-110 transition duration-300 overflow-hidden"
              :src="'https://image.tmdb.org/t/p/original' + item.poster_path"
              :alt="item.name"
            />
            <span
              @click="handlelike(item)"
              class="transition w-8 h-8 duration-200 cursor-pointer active:scale-75 flex justify-center items-center rounded-full absolute top-4 end-4"
            >
              <span v-html="heartPramiary"></span
            ></span>
          </div>
          <p
            class="dark:text-white p-1 w-full text-lg transition-colors duration-500 text-center truncate"
          >
            {{ item.name || item.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>

<style scoped></style>
