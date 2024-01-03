<script>
import { ref } from "vue";
import MainSwiper from "../components/Home/MainSwiper.vue";
import Sliders from "../components/Home/Sliders.vue";
export default {
  setup() {
    return {};
  },
  components: { MainSwiper, Sliders },
};
</script>
<template>
  <div class="w-full min-h-screen">
    <MainSwiper />
    <Sliders
      url="https://api.themoviedb.org/3/movie/now_playing"
      :d="null"
      type="movie"
      title="Movies On Air"
    />
    <Sliders
      :url="`https://api.themoviedb.org/3/tv/airing_today`"
      :d="null"
      type="tv"
      title="TVs On Air"
    />
    <Sliders
      url="https://api.themoviedb.org/3/trending/person/"
      d="day"
      :type="null"
      title="Tranding Actors"
    />
    <Sliders :url="null" d="day" type="movie" title="Tranding Movies" />
    <Sliders :url="null" d="day" type="tv" title="Tranding TVs" />
  </div>
</template>
<style scoped></style>
