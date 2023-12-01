<script setup>
import { defineProps, onMounted, ref } from "vue";
import Loading from "../Sections/Loading.vue";
import MainBox from "../components/Details/MainBox.vue";
import Relatied from "../components/Details/Relatied.vue";
import { watch } from "vue";

//variables
let { id, type } = defineProps(["id", "type"]);
let uid = ref(id);
let view = ref(true);
let isLoading = ref(true);

//function
function getLoading(e) {
  isLoading.value = e;
}

watch(id, () => {
  console.log(id);
});
function rerender() {
  view.value = false;
  setTimeout(() => {
    view.value = true;
  }, 0);
}
</script>

<template>
  <div class="w-full bg-gray-200 dark:bg-third">
    <div class="pt-28 flex flex-col min-h-screen w-[95%] mx-auto">
      <div class="w-full">
        <MainBox
          v-if="view"
          @stopLoading="getLoading"
          :type="type"
          :id="id"
        />
        <Relatied
          @rerender="rerender"
          @startLoading="getLoading"
          :id="id"
          :type="type"
        />
      </div>
      <Loading v-if="isLoading" />
    </div>
  </div>
</template>

<style scoped></style>
