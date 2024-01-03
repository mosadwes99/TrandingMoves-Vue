<script setup>
import { defineProps, defineEmits, onMounted, ref, reactive } from "vue";
import GetData from "../../hooks/GetData";
import { Swiper, SwiperSlide } from "swiper/vue";
import CuroselButton from "../../Sections/CuroselButton.vue";
import { FreeMode, Autoplay } from "swiper/modules";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//variables
let { d, url, type, title } = defineProps(["url", "d", "type", "title"]);
let { content, getData } = GetData();
let modules = [FreeMode, Autoplay];
let router = useRouter();
let emit = defineEmits(["startLoading"]);
let route = useRoute();
let date = ref(d);
let isLoading = ref(true);

onMounted(() => {
  if (d) {
    if (type === "movie") {
      console.log("m");
      getData(`https://api.themoviedb.org/3/trending/movie/${date.value}`);
    } else if (type === "tv") {
      console.log("t");
      getData(`https://api.themoviedb.org/3/trending/tv/${date.value}`);
    } else {
      console.log("mo");
      getData(`${url}${date.value}`);
    }
  } else {
    getData(`${url}`);
  }
});

watch(date, () => {
  if (type === "movie") {
    console.log("m");
    getData(`https://api.themoviedb.org/3/trending/movie/${date.value}`);
  } else if (type === "tv") {
    getData(`https://api.themoviedb.org/3/trending/tv/${date.value}`);
  } else {
    console.log("mo");
    getData(`${url}${date.value}`);
  }
});

function handlemovie(e) {
  if (type) {
    router.push({
      name: "details",
      params: { id: e.id, type: type },
    });
  }
}

function dateStyle(e) {
  if (e === date.value) {
    return "text-white/50 bg-fourth ";
  } else {
    return "text-white bg-pramiary ";
  }
}

function handleDate(e) {
  date.value = e.target.value;
}
</script>

<template>
  <div class="w-full lg:p-12 py-2" v-if="content.results">
    <Swiper
      :modules="modules"
      :free-mode="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :breakpoints="{
        '30': {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        '1024': {
          slidesPerView: 8,
          spaceBetween: 20,
        },
      }"
      class="flex flex-col-reverse h-full"
    >
      <div class="flex flex-col lg:p-0 p-2 w-full">
        <div class="flex items-center justify-between w-full">
          <p
            class="dark:text-white text-2xl transition-colors duration-500 py-4 p-2 font-semibold"
          >
            {{ title }}
          </p>

          <div v-if="date" class="flex gap-[0.9px] p-1 w-fit">
            <button
              value="day"
              @click="handleDate"
              :class="dateStyle('day')"
              class="text-lg rounded-l-xl w-20 p-1 px-4 font-semibold transition"
            >
              Day
            </button>

            <button
              class="text-lg rounded-r-xl w-20 p-1 px-4 font-semibold transition"
              value="week"
              :class="dateStyle('week')"
              @click="handleDate"
            >
              Week
            </button>
          </div>

          <CuroselButton v-else />
        </div>
      </div>

      <SwiperSlide v-for="item in content.results" class="">
        <div
          class="overflow-hidden rounded-lg h-full cursor-pointer"
          @click="handlemovie(item)"
        >
          <img
            class="hover:scale-110 transition duration-300 aspect-[2/3] object-cover rounded-lg"
            :src="`https://image.tmdb.org/t/p/original${
              item.profile_path || item.poster_path
            } `"
            alt=""
          />
        </div>
        <p
          class="dark:text-white p-1 w-full text-xl transition-colors duration-500 text-center truncate"
        >
          {{ item.name || item.title }}
        </p>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped></style>
