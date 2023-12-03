<script setup>
import { defineProps, onMounted, ref } from "vue";
import GetData from "../../hooks/GetData";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Autoplay } from "swiper/modules";
import { watch } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";

//variables
let { id, type } = defineProps(["id", "type"]);
let { content, getData } = GetData();
let modules = [FreeMode, Autoplay];
let cast = ref("");
let route = useRoute();

//functions
onMounted(() => {
  if ((type = "movie")) {
    getData(`https://api.themoviedb.org/3/movie/${route.params.id}/credits`);
  } else {
    getData(
      `https://api.themoviedb.org/3/tv/${route.params.id}/aggregate_credits`
    );
  }
});

onBeforeRouteUpdate(() => {
  cast.value = ""
  setTimeout(() => {
    if ((type = "movie")) {
      getData(`https://api.themoviedb.org/3/movie/${route.params.id}/credits`);
    } else {
      getData(
        `https://api.themoviedb.org/3/tv/${route.params.id}/aggregate_credits`
      );
    }
  } , 0);
});

function getCast() {
  let data = [];
  content.value.cast.map((item) => {
    if (item.profile_path) {
      data = [...data, item];
    }
  });
  cast.value = data;
}

watch(content, () => {
  getCast();
});
</script>

<template>
  <div class="w-full">
    <p class="dark:text-white text-2xl p-2 font-semibold">Cast</p>
    <Swiper
      :modules="modules"
      :free-mode="true"
      :autoplay="{
        delay: 2000,
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
          slidesPerView: 6.5,
          spaceBetween: 20,
        },
      }"
    >
      <SwiperSlide v-if="cast" v-for="person in cast" key="{index}">
        <div className="  w-full text-white">
          <img
            class="object-cover object-center brightness-50 w-full rounded-lg"
            :src="'https://image.tmdb.org/t/p/original' + person.profile_path"
            alt="img"
            srcset=""
          />
          <p
            class="text-center text-lg transiti duration-500 text-black dark:text-white"
          >
            {{ person.name }}
          </p>
        </div>
      </SwiperSlide>
      <p v-else class="p-2">There are no informations</p>
    </Swiper>
  </div>
</template>

<style scoped></style>
