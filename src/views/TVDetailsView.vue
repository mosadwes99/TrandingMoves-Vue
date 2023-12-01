<script setup>
import { defineProps, onMounted } from "vue";
import GetData from "../hooks/GetData";
let { id } = defineProps(["id"]);

//function
onMounted(() => {});
</script>
<template>
  <div class="w-full">
    <div class="pt-28 flex flex-col min-h-screen w-[80%] mx-auto">
      <p class="">tv{{ id }}</p>
    </div>
  </div>
</template>

<style scoped></style>
