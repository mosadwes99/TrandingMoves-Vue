import { ref } from "vue";
import { defineStore } from "pinia";

export let  useLoginStore = defineStore("login", () => {
  const login = ref(false);

  function setLogin() {
    login.value = true;
  }
  function setLogout() {
    login.value = false;
  }

  return { login, setLogin , setLogout };
});
