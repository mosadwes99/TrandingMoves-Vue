<script setup>
import { defineProps, ref } from "vue";
import Loading from "../Sections/Loading.vue";
import MainBox from "../components/Details/MainBox.vue";
import Relatied from "../components/Details/Relatied.vue";
import { watch } from "vue";
import { useRoute } from "vue-router";

//variables

let view = ref(true);
let isLoading = ref(true);
let route = useRoute();

//function
function getLoading(e) {
  isLoading.value = e;
}


</script>

<template>
  <div class="w-full bg-gray-200 dark:bg-third">
    <div class="pt-28 flex flex-col min-h-screen w-[95%] mx-auto">
      <div class="w-full">
        <MainBox v-if="view" @stopLoading="getLoading" />
        <Relatied @startLoading="getLoading" />
      </div>
      <Loading v-if="isLoading" />
    </div>
  </div>
</template>

<style scoped></style>
