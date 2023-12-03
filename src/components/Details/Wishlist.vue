<script setup>
import { defineEmits, defineProps, onMounted, reactive, ref } from "vue";
import { db } from "../../FireStore/store";
import Cookie from "universal-cookie";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from "vue-router";

//variables
let router = useRouter();
let rerender = ref(true);
let route = useRoute();
let cookie = new Cookie();
let currentUser = cookie.get("currentUser");
let { content } = defineProps(["content"]);
let emit = defineEmits(["loading", "getFirestoreData"]);
let wishlistValue = ref(getWishlistButtonValue());
let wishlistCardVlaue = reactive({
  wantToWatch: 0,
  watchingNow: 0,
  completeItLater: 0,
  iDonNotWantToWatchIt: 0,
  itHasBeenWatched: 0,
});

//finctions
function getWishlistButtonValue() {
  let wishlist = localStorage.getItem("wishlist");
  wishlist = JSON.parse(wishlist);
  if (currentUser) {
    if (wishlist.some((item) => item.id === route.params.id)) {
      return wishlist.filter((item) => item.id == route.params.id)[0].value;
    } else {
      return "";
    }
  }
}

async function handleWishlist() {
  let wishlist = localStorage.getItem("wishlist");
  wishlist = JSON.parse(wishlist);
  if (currentUser) {
    emit("loading", true);
    let wishlistQuery = query(
      collection(db, "wishlists"),
      where("userUid", "==", currentUser.uid),
      where("uid", "==", route.params.id)
    );
    let userWishlist = doc(db, "users", currentUser.uid);

    if (wishlist.some((item) => item.id === route.params.id)) {
      let list = wishlist.filter((item) => item.id == route.params.id)[0];

      // if (list.value === wishlistValue.value) {
        // await updateDoc(userWishlist, {
        //   wishlist: arrayRemove(list),
        // });
        // let querySnapshot = await getDocs(wishlistQuery);
        // querySnapshot.forEach((data) => {
        //   let ref = doc(db, "wishlists", data.id);
        //   deleteDoc(ref);
        // });
      // } else {
      await updateDoc(userWishlist, {
        wishlist: arrayRemove(list),
      });
      await updateDoc(userWishlist, {
        wishlist: arrayUnion({
          id: route.params.id,
          value: wishlistValue.value,
          type: route.params.type,
        }),
      });
      let querySnapshot = await getDocs(wishlistQuery);
      querySnapshot.forEach((data) => {
        let ref = doc(db, "wishlists", data.id);
        updateDoc(ref, {
          value: wishlistValue.value,
        });
      });
      // }
      getDataFireStore();
    } else {
      if (wishlistValue.value) {
        await addDoc(collection(db, "wishlists"), {
          value: wishlistValue.value,
          uid: route.params.id,
          userUid: currentUser.uid,
        });
        await updateDoc(userWishlist, {
          wishlist: arrayUnion({
            id: route.params.id,
            value: wishlistValue.value,
            type: route.params.type,
          }),
        });
      } else {
        console.log("err");
      }
      wishlistCard();
      getDataFireStore();
    }
  } else {
    router.push("/login");
  }
}

onBeforeRouteUpdate(() => {
  setTimeout(() => {
    wishlistCard();
  }, 0);
});

async function wishlistCard() {
  wishlistCardVlaue.wantToWatch = 0;
  wishlistCardVlaue.watchingNow = 0;
  wishlistCardVlaue.completeItLater = 0;
  wishlistCardVlaue.iDonNotWantToWatchIt = 0;
  wishlistCardVlaue.itHasBeenWatched = 0;
  let data = [];
  let wishlistQuery = query(
    collection(db, "wishlists"),
    where("uid", "==", route.params.id)
  );
  let querySnapshot = await getDocs(wishlistQuery);
  querySnapshot.forEach((doc) => {
    data = [...data, doc.data()];
  });
  data.forEach((item) => {
    if (item.value === "Want to watch") {
      wishlistCardVlaue.wantToWatch += 1;
    } else if (item.value === "Watching now") {
      wishlistCardVlaue.watchingNow += 1;
    } else if (item.value === "Complete it later") {
      wishlistCardVlaue.completeItLater += 1;
    } else if (item.value === "I don't want to watch it") {
      wishlistCardVlaue.iDonNotWantToWatchIt += 1;
    } else if (item.value === "It has been watched") {
      wishlistCardVlaue.itHasBeenWatched += 1;
    }
  });
}

onMounted(() => {
  wishlistCard();
});

function calculateWidth(value) {
  let total =
    wishlistCardVlaue.completeItLater +
    wishlistCardVlaue.watchingNow +
    wishlistCardVlaue.wantToWatch +
    wishlistCardVlaue.iDonNotWantToWatchIt +
    wishlistCardVlaue.itHasBeenWatched;
  return (value / total) * 100;
}

async function getDataFireStore() {
  let q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let Data = doc.data();
    localStorage.setItem("wishlist", JSON.stringify(Data.wishlist));
  });
  wishlistCard();
  emit("loading", false);
}
</script>

<template>
  <div v-if="rerender" class="flex gap-4 flex-col justify-start w-full">
    <div class="w-full">
      <label class="px-1 w-fit">
        <span class="text-pramiary label-text -mb-1"
          >Add to your whishlist</span
        >
      </label>
      <select
        @change="handleWishlist"
        v-model="wishlistValue"
        class="select select-bordered w-full dark:text-white transition-colors duration-500 dark:bg-fourth"
      >
        <option>Want to watch</option>

        <option>Watching now</option>

        <option>Complete it later</option>

        <option>I don't want to watch it</option>

        <option>It has been watched</option>
      </select>
    </div>

    <div
      class="dark:text-white flex flex-col gap-4 w-full shadow-lg p-4 transition-colors duration-500 dark:bg-fourth shadow-slate-400 rounded-lg bg-white dark:shadow-black/50"
    >
      <div class="flex items-center gap-2">
        <p class="w-1/3 text-sm">Want to watch</p>

        <div
          class="w-1/2 h-1 rounded-3xl dark:bg-third bg-gray-200 transition-colors duration-500"
        >
          <p
            class="bg-pramiary transition-all duration-300 h-1"
            id
            :style="{
              width: `${calculateWidth(wishlistCardVlaue.wantToWatch) || 0}%`,
            }"
          ></p>
        </div>

        <p
          class="px-4 text-sm text-black/50 dark:text-white/40 transition-colors duration-500"
        >
          {{ wishlistCardVlaue.wantToWatch }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <p class="w-1/3 v">Watching now</p>

        <div
          class="w-1/2 h-1 rounded-3xl dark:bg-third bg-gray-200 transition-colors duration-500"
        >
          <p
            class="bg-pramiary transition-all duration-300 h-1"
            :style="{
              width: `${calculateWidth(wishlistCardVlaue.watchingNow) || 0}%`,
            }"
          ></p>
        </div>

        <p
          class="px-4 text-sm text-black/50 dark:text-white/40 transition-colors duration-500"
        >
          {{ wishlistCardVlaue.watchingNow }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <p class="w-1/3 text-sm">Complete it later</p>

        <div
          class="w-1/2 h-1 rounded-3xl dark:bg-third bg-gray-200 transition-colors duration-500"
        >
          <p
            class="bg-pramiary transition-all duration-300 h-1"
            :style="{
              width: `${
                calculateWidth(wishlistCardVlaue.completeItLater) || 0
              }%`,
            }"
          ></p>
        </div>

        <p
          class="px-4 text-sm text-black/50 dark:text-white/40 transition-colors duration-500"
        >
          {{ wishlistCardVlaue.completeItLater }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <p class="w-1/3 text-sm">I don't want to watch it</p>

        <div
          class="w-1/2 h-1 rounded-3xl dark:bg-third bg-gray-200 transition-colors duration-500"
        >
          <p
            class="bg-pramiary transition-all duration-300 h-1"
            :style="{
              width: `${
                calculateWidth(wishlistCardVlaue.iDonNotWantToWatchIt) || 0
              }%`,
            }"
          ></p>
        </div>

        <p
          class="px-4 text-sm text-black/50 dark:text-white/40 transition-colors duration-500"
        >
          {{ wishlistCardVlaue.iDonNotWantToWatchIt }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <p class="w-1/3 text-sm">It has been watched</p>

        <div
          class="w-1/2 h-1 rounded-3xl dark:bg-third bg-gray-200 transition-colors duration-500"
        >
          <p
            class="bg-pramiary transition-all duration-300 h-1"
            :style="{
              width: `${
                calculateWidth(wishlistCardVlaue.itHasBeenWatched) || 0
              }%`,
            }"
          ></p>
        </div>

        <p
          class="px-4 text-sm text-black/50 dark:text-white/40 transition-colors duration-500"
        >
          {{ wishlistCardVlaue.itHasBeenWatched }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
