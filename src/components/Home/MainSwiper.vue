<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import getdata from "../../hooks/GetData";
import { onMounted, ref, watch } from "vue";
import { Autoplay } from "swiper/modules";
import { useRouter } from "vue-router";

//variables
let modules = [Autoplay];
let router = useRouter();
let { content, getData } = getdata();
let searchWord = ref("");
//functions
onMounted(() => {
  getData(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2"
  );
});

function search() {
  router.push({ name: "search", params: { id: searchWord.value } });
}
</script>

<template>
  <div class="w-full relative">
    <Swiper
      :modules="modules"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :slidesPerView="1"
      class="lg:h-[75vh]"
    >
      <SwiperSlide v-for="movie in content.results" key="{index}">
        <div className="  w-full text-white">
          <img
            class="object-cover object-center lg:h-full h-[50vh] brightness-50 w-full"
            :src="'https://image.tmdb.org/t/p/original' + movie.backdrop_path"
            alt=""
            srcset=""
          />
        </div>
      </SwiperSlide>
    </Swiper>

    <div
      class="top-0 start-0 absolute w-full h-full z-10 flex justify-center items-center"
    >
      <form @submit.prevent="search" class="lg:w-1/2 w-3/4 block relative">
        <button>
          <img
            src="../../assets/icons/search-alt-2-svgrepo-com.svg"
            class="lg:w-9 w-7 absolute end-4 lg:end-10 lg:top-3 top-2"
            alt=""
          />
        </button>

        <input
          v-model="searchWord"
          type="text"
          class="w-full focus:outline-none placeholder:text-white/20 text-white bg-third border-[1px] px-6 text-xl lg:py-4 py-2 rounded-full border-pramiary"
          placeholder="search..."
        />
      </form>
    </div>
  </div>
</template>

<style scoped></style>
