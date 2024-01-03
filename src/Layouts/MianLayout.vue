<script setup>
import { RouterView } from "vue-router";
import Nav from "../components/Nav/Nav.vue";
import Footer from "../Sections/Footer.vue";
import { ref } from "vue";

let scroll = ref(0);

function darkToggle() {
  let element = document.getElementById("parent");
  element.classList.toggle("dark");
}

function getScroll() {
  scroll.value = window.scrollY;
}

function getTop() {
  scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
window.addEventListener("scroll", getScroll);
</script>

<template>
  <div class="w-full dark" id="parent">
    <div class="dark:bg-third relative transition-colors duration-500">
      <div
      v-if="scroll>500"
      @click="getTop"
        class="lg:w-14 w-14 lg:h-14 z-30 h-14 fixed flex justify-center items-center rounded-full bottom-5 lg:end-10 end-4 cursor-pointer bg-pramiary"
      >
        <img
          class="lg:w-20 w-16"
          src="../assets/icons/top-arrow-5-svgrepo-com.svg"
          alt=""
        />
      </div>

      <Nav @darkToggle="darkToggle" />

      <RouterView />

      <Footer/>
    </div>
  </div>
</template>

<style scoped></style>
