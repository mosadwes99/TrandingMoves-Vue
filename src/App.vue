<script setup>
import { RouterLink, RouterView } from "vue-router";
import Nav from "./components/Nav/Nav.vue";
import { ref } from "vue";

function darkToggle() {
  let element = document.getElementById("parent");
  element.classList.toggle("dark");
}
</script>

<template>
  <div class="w-full dark  " id="parent">
    <div class="dark:bg-third  transition-colors duration-500 ">
      <!-- <div  class="lg:w-16 w-14  lg:h-16 h-14 absolute flex justify-center items-center rounded-full bottom-5 lg:end-10 end-4 bg-pramiary"><img class="lg:w-20 w-16" src="../src/assets/icons/top-arrow-5-svgrepo-com.svg" alt=""></div> -->
      <Nav @darkToggle="darkToggle" />
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
