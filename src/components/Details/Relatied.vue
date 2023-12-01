<script setup>
import { defineProps, defineEmits, onMounted, ref } from "vue";
import GetData from "../../hooks/GetData";
import { Swiper, SwiperSlide } from "swiper/vue";
import CuroselButton from "../../Sections/CuroselButton.vue";
import { FreeMode, Autoplay } from "swiper/modules";
import { watch } from "vue";
import { useRouter } from "vue-router";

//variables
let { id, type } = defineProps(["id", "type"]);
let { content, getData } = GetData();
let modules = [FreeMode, Autoplay];
let router = useRouter();
let emit = defineEmits(["startLoading", "render"]);
let similar = ref("");

//functions
onMounted(() => {
  getData(`
https://api.themoviedb.org/3/${type}/${id}/similar`);
});

function getSimilar() {
  let data = [];
  content.value.results.map((item) => {
    if (item.poster_path) {
      data = [...data, item];
    }
  });
  similar.value = data;
}

watch(content, () => {
  getSimilar();
});

function handlemovie(e) {
  router.push({
    name: "details",
    params: { id: e.id, type: type },
  });

  emit("startLoading", true);
  emit("rerender");
}
</script>

<template>
  <div class="w-full lg:p-12 py-2">
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
      class="flex flex-col-reverse"
    >
      <div class="flex items-center justify-between lg:p-0 p-2">
        <p
          class="dark:text-white text-2xl transition-colors duration-500 py-4 p-2 font-semibold"
        >
          similar {{ type }}
        </p>
        <CuroselButton />
      </div>

      <SwiperSlide v-for="item in similar">
        <div
          class="overflow-hidden rounded-lg cursor-pointer"
          @click="handlemovie(item)"
        >
          <img
            class="hover:scale-110 transition duration-300 rounded-lg h-full"
            :src="'https://image.tmdb.org/t/p/original' + item.poster_path"
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
