<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Loading from "../Sections/Loading.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper/modules";
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
let filterWord = ref("Want to watch");
let content = ref([]);
let error = ref(null);
let isLoading = ref(true);
let modules = [FreeMode];
let swiperValue = ref([
  "Want to watch",
  "Watching now",
  "Complete it later",
  "I don't want to watch it",
  "It has been watched",
]);

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
    let wishlist = localStorage.getItem("wishlist");
    wishlist = JSON.parse(wishlist);
    wishlist = wishlist.filter((item) => item.value == filterWord.value);
    if (wishlist.length) {
      let fetchDataPromises = wishlist.map(async (item) => {
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

watch(filterWord, () => {
  getData();
});

function swiperStyle(item) {
  if (item === filterWord.value) {
    return "text-pramiary";
  } else {
    return "dark:text-white/60 text-black/60";
  }
}

function route(e) {
  let wishlist = localStorage.getItem("wishlist");
  wishlist = JSON.parse(wishlist);
  wishlist = wishlist.filter((item) => item.id == e.id);
  console.log(wishlist);
  router.push({
    name: "details",
    params: { id: e.id, type: wishlist[0].type },
  });
}

function handleSwiperClick(e) {
  filterWord.value = e.target.textContent;
}

async function handleWishlist(item) {
  let wishlist = localStorage.getItem("wishlist");
  wishlist = JSON.parse(wishlist);
  isLoading.value = true;
  let wishlistQuery = query(
    collection(db, "wishlists"),
    where("userUid", "==", currentUser.uid),
    where("uid", "==", item.id)
  );
  let userWishlist = doc(db, "users", currentUser.uid);
  let list = wishlist.filter((wish) => wish.id == item.id)[0];

  await updateDoc(userWishlist, {
    wishlist: arrayRemove(list),
  });
  let querySnapshot = await getDocs(wishlistQuery);
  querySnapshot.forEach((data) => {
    let ref = doc(db, "wishlists", data.id);
    deleteDoc(ref);
  });
  await getDataFireStore();
}

async function getDataFireStore() {
  let q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let Data = doc.data();
    localStorage.setItem("wishlist", JSON.stringify(Data.wishlist));
  });
  await getData();
}
</script>

<template>
  <div class="w-full">
    <div class="pt-28 flex flex-col min-h-screen w-[80%] mx-auto">
      <Swiper
        :modules="modules"
        :free-mode="true"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        :breakpoints="{
          '30': {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          '768': {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          '1024': {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }"
        class="flex w-full lg:w-3/4 pb-10 p-2"
      >
        <SwiperSlide
          v-for="item in swiperValue"
          :id="item"
          @click="handleSwiperClick"
          class="w-fit text-center"
        >
          <p
            :class="swiperStyle(item)"
            class="w-fit lg:text-lg text-sm transition duration-300 dark:hover:text-pramiary hover:text-pramiary font-semibold active:scale-95 cursor-pointer"
          >
            {{ item }}
          </p>
        </SwiperSlide>
      </Swiper>

      <div v-if="!content.length && !isLoading">
        <p class="text-pramiary lg:text-3xl font-bold w-full">
          Wishlist  is empty:
        </p>
      </div>

      <div class="w-full grid lg:grid-cols-6 grid-cols-1 gap-3">
        <div
          :key="item.id"
          v-if="content.length !== 0"
          v-for="item in content"
          class="col-span-1 row-span-2 lg:row-span-1 relative rounded-lg overflow-hidden group"
        >
          <div class="overflow-hidden">
            <img
              @click="route(item)"
              class="object-cover cursor-pointer group-hover:scale-110 transition duration-300 overflow-hidden"
              :src="'https://image.tmdb.org/t/p/original' + item.poster_path"
              :alt="item.name"
            />
            <span
              @click="handleWishlist(item)"
              class="w-8 h-8 opacity-0 transition duration-200 cursor-pointer active:scale-75 group-hover:opacity-100 flex justify-center items-center rounded-full bg-pramiary absolute top-4 end-4"
              ><img
                src="/src/assets/icons/close-svgrepo-com.svg"
                class="w-5"
                alt=""
            /></span>
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
