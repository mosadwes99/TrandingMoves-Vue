<script setup>
import { defineProps, onMounted, onUpdated, ref, watchEffect } from "vue";
import GetData from "../hooks/GetData";
import { watch } from "vue";
import Loading from "../Sections/Loading.vue";
import { useRouter } from "vue-router";

let { id } = defineProps(["id"]);
let { content, getData } = GetData();
let router = useRouter();
let paginationNumber = ref([]);
let data = ref([]);
let pageNumber = ref(1);

//function
function getPaginationLength() {
  if (content.value.total_results !== 0) {
    let totalPages = content.value.total_pages;
    let pagesArray = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
    paginationNumber.value = pagesArray;
  }
}

onMounted(() => {
  getData(
    `https://api.themoviedb.org/3/search/multi?query=${id}&include_adult=false&language=en-US&page=${pageNumber.value}`
  );
});

watch(pageNumber, () => {
  getData(
    `https://api.themoviedb.org/3/search/multi?query=${id}&include_adult=false&language=en-US&page=${pageNumber.value}`
  );
  console.log(content.value.results);
});

watch(content, () => {
  if (content.value.results) {
    data.value = content.value.results;
    getPaginationLength();
  } else {
    console.log("none");
  }
});

function getMovie() {
  let list = [];
  content.value.results.map((item) => {
    if (item.poster_path) {
      list = [...list, item];
    }
  });
  data.value = list;
}

watch(content, () => {
  getMovie();
});

function handlePagination(e) {
  pageNumber.value = e;
}

function pageNumberStyle(e) {
  return e == pageNumber.value ? "bg-pramiary text-white" : "";
}

function route(e) {
    router.push({ name: "details", params: { id: e.id, type: e.media_type } });
  }


function getTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="w-full">
    <div class="pt-28 flex flex-col min-h-screen w-[80%] mx-auto">
      <div>
        <p
          class="text-pramiary text-3xl font-bold w-full"
          v-if="content.total_results === 0"
        >
          There Are No Matching Results:
        </p>
      </div>

      <div class="w-full grid lg:grid-cols-5 grid-cols-1 gap-3">
        <div
          :key="item.id"
          v-if="content.results"
          v-for="item in data"
          class="col-span-1 row-span-2 lg:row-span-1 relative rounded-lg overflow-hidden group"
        >
          <img
            class="object-cover"
            :src="'https://image.tmdb.org/t/p/original' + item.poster_path"
            :alt="item.name"
          />

          <div
            class="w-full h-full flex flex-col gap-2 text-xl bg-third/80 translate-y-full group-hover:translate-y-0 transition duration-700 absolute top-0 start-0 p-2 text-white/80"
          >
            <div class="flex flex-col w-fit">
              <p>Details</p>
              <span class="h-[0.2px] bg-white/50"></span>
            </div>

            <span class="text-pramiary w-full truncate">{{
              item.title || item.name
            }}</span>

            <p>
              {{ item.media_type }}
            </p>

            <p class="h-[12.1rem] overflow-hidden">
              {{ item.overview ? item.overview : "Unknown" }}
            </p>

            <button
              @click="route(item)"
              class="bg-pramiary w-1/2 mx-auto rounded-lg p-2 lg:mt-12 mt-28 active:scale-95"
            >
              Know More..
            </button>
          </div>
        </div>
        <Loading v-else />
      </div>

      <div>
        <div
          v-if="paginationNumber.length"
          class="flex justify-center gap-2 p-20 flex-wrap"
        >
          <div
            v-for="item in paginationNumber"
            @click="handlePagination(item)"
            class="w-12 h-12 font-semibold hover:text-white dark:text-white ring-2 ring-pramiary text-center rounded-full leading-[3rem] transition duration-200 cursor-pointer hover:bg-pramiary"
            :class="pageNumberStyle(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
