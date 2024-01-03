<script setup>
import { useLoginStore } from "../stores/LogStore";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../FireStore/store";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "universal-cookie";
import { collection, getDocs, query, where } from "firebase/firestore";

//variables
let router = useRouter();
let cookie = new Cookies();
let { setLogin } = useLoginStore();

let isLoading = ref(false);
let view = ref(false);
let getData = reactive({
  email: "",
  password: "",
});

let dataError = reactive({
  email: null,
  password: null,
});

let errorMessage = ref("");

onMounted(() => {
  view.value = true;
});

//function
function changeData(e) {
  //handdle email data
  if (e.target.name === "email") {
    if (getData.email.includes(".co") || getData.email.includes(".ne")) {
      dataError.email = "";
    } else if (getData.email === "") {
      dataError.email = "Email is required";
    } else {
      dataError.email = "Invalid email address";
    }
  }
  //handdle password data
  else if (e.target.name == "password") {
    if (getData.password.length >= 6) {
      dataError.password = "";
    } else if (getData.password === "") {
      dataError.password = "Password is required";
    } else {
      dataError.password = "Password must be at least 6 characters long";
    }
  }
}

async function getDataFireStore() {
  let Data = [];
  let q = query(
    collection(db, "users"),
    where("uid", "==", auth.currentUser.uid)
  );
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    Data = doc.data();
  });
  cookie.set("currentUser", Data);
  localStorage.setItem("likes", JSON.stringify(Data.likes));
  localStorage.setItem("wishlist", JSON.stringify(Data.wishlist));
  localStorage.setItem("login", JSON.stringify(true));
}

async function submitForm(e) {
  if (dataError.email == "" && dataError.password == "") {
    isLoading.value = true;
    try {
      await signInWithEmailAndPassword(auth, getData.email, getData.password);
      setLogin();
      getDataFireStore();
      router.push({ name: "home" });
    } catch (error) {
      errorMessage.value = "There are wrong in email or password";
      isLoading.value = false;
    }
  } else {
    dataRquired(e);
  }
}
</script>
<template>
  <div className="bg-fourth">
    <Transition name="sign">
      <div
        v-if="view"
        className="bg-black/40 flex justify-center items-center h-screen w-full"
      >
        <div
          className="bg-third border border-pramiary p-[56px] rounded-2xl w-full md:pt-30  md:w-[430px] h-screen md:h-auto md:block flex flex-col justify-center "
        >
          <div className="w-full flex justify-center mb-0">
            <img
              src="/src/assets/Img/TM.png"
              class="w-80 cursor-pointer"
              @click="router.push({ name: 'home' })"
            />
          </div>

          <span
            className="text-[30px] font-bold text-white/50 -mt-3 mb-[18px] text-center inline-block w-full "
          >
            Sign In
          </span>

          <form @submit.prevent="submitForm">
            <div className="w-full mb-2">
              <div className="text-lg mb-3 font-semibold  text-white/50">
                <label htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                name="email"
                type="text"
                id="email"
                @input="changeData"
                className="signInput"
                v-model="getData.email"
              />
              <span className="text-red-500">{{ dataError.email }}</span>
            </div>

            <div className="w-full mb-[28px]">
              <div className="text-lg mb-3 font-semibold text-white/50">
                <label htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                name="password"
                type="password"
                id="password"
                @input="changeData"
                v-model="getData.password"
                className=" signInput"
              />
              <span className="text-red-500">{{ dataError.password }}</span>
              <span className="text-red-500">{{ errorMessage }}</span>
            </div>

            <button v-if="isLoading" className="submitButton ">
              <div className="submitSpinner"></div>
            </button>

            <button v-else className="submitButton ">SIGN IN</button>
          </form>

          <div
            className="text-center text-white/50 text-[18px] mt-[12px] font-semibold font-sans  "
          >
            <span>Don't have account, </span>
            <span
              className="focus:underline text-orange-400 cursor-pointer"
              @click="router.push({ name: 'signup' })"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.sign-enter-active,
.sign-leave-active {
  transition: opacity 0.5s ease;
}

.sign-enter-from,
.sign-leave-to {
  opacity: 0;
}
</style>
