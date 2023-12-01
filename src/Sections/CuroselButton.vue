<script setup>
import { useSwiper } from "swiper/vue";

let prevArrow = `<svg xmlns="http://www.w3.org/2000/svg" class="fill-pramiary group-hover:fill-white  transition duration-300" height="16" width="10" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`;
let nextArrow = `<svg xmlns="http://www.w3.org/2000/svg" class="fill-pramiary group-hover:fill-white  transition duration-300" height="16" width="10" viewBox="0 0 320 512"><!--!Font Awesome Free 6.5.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;
let swiper = useSwiper();
</script>

<template>
  <div class="flex p-4">
    <button
      className="group border-[2.5px] hover:text-white flex justify-center items-center hover:bg-pramiary transition duration-300  me-3 border-pramiary w-8 h-8 rounded-full"
      @click="swiper.slidePrev"
    >
      <i v-html="prevArrow"></i>
    </button>

    <button
      className="group border-[2.5px] hover:text-white  flex justify-center items-center hover:bg-pramiary transition duration-300  border-pramiary w-8 h-8 rounded-full"
      @click="swiper.slideNext"
    >
      <i clas v-html="nextArrow"></i>
    </button>
  </div>
</template>

<style scoped></style>
