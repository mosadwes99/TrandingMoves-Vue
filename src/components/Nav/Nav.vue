<script setup>
import { RouterLink } from "vue-router";
import DarkmodeToggle from "./darkmodeToggle.vue";
import { defineEmits } from "vue";

let emit = defineEmits(["darkToggle"]);

function darkToggle() {
  emit("darkToggle");
}
</script>
<template>
  <nav
    class="w-full z-30 bg-black/60 flex justify-between p-3 lg:px-48 px-6 fixed top-0"
  >
    <div class="flex items-center lg:gap-5 gap-2">
      <router-link to="/"
        ><img src="../../assets/Img/TM.png" class="lg:w-20 w-16" alt="" />
      </router-link>
      <p class="lg:text-3xl lg:block hidden text-white/90">
        <span class="text-pramiary font-semibold">T</span>rending
        <span class="text-pramiary font-semibold">M</span>ovies
      </p>
    </div>

    <div class="flex lg:gap-10 gap-4 items-center">
      <div><DarkmodeToggle @darkToggle="darkToggle" /></div>

      <button class="bg-pramiary h-8 px-3 lg:text-lg rounded-md text-white">
        Sign In
      </button>
    </div>
  </nav>
</template>
<style scoped></style>
