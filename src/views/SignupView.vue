<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../FireStore/store";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

//variables
let router = useRouter();
let view = ref(false);
let isLoading = ref(false);
let getData = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

let dataError = reactive({
  email: null,
  password: null,
  confirmPassword: null,
});

let errorMessage = ref("");

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
  //handdle confirmPassword data
  else {
    if (getData.confirmPassword == getData.password) {
      dataError.confirmPassword = "";
    } else {
      dataError.confirmPassword = "They're not matching";
    }
  }
}

async function dataRquired(e) {
  for (let i = 0; i < 3; i++) {
    if (dataError[e.target[i].name] == null) {
      dataError[e.target[i].name] = `${e.target[i].name} is required`;
    }
  }
  console.log(dataError);
}

async function updateData() {
  await setDoc(doc(db, "users", auth.currentUser.uid), {
    uid: auth.currentUser.uid,
    likes: [],
    wishlist: [],
  });
}

async function submitForm(e) {
  if (
    dataError.email == "" &&
    dataError.password == "" &&
    dataError.confirmPassword == ""
  ) {
    isLoading.value = true;
    try {
      await createUserWithEmailAndPassword(
        auth,
        getData.email,
        getData.password
      );
      updateData();
      // Redirect to the home page after successful registration
      router.push({ name: "login" });
    } catch (error) {
      isLoading.value = false;
      errorMessage.value = "The email already exists";
    }
  } else {
    dataRquired(e);
  }
}
onMounted(() => {
  view.value = true;
});
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
            Create Account
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

            <div className="w-full mb-2">
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
            </div>

            <div className="w-full mb-[4rem]">
              <div className="text-lg mb-3 font-semibold text-white/50">
                <label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                name="confirmPassword"
                v-model="getData.confirmPassword"
                type="password"
                id="confirmPassword"
                @input="changeData"
                className=" signInput"
              />
              <span className="text-red-500">
                {{ dataError.confirmPassword }}
              </span>
              <span className="text-red-500">{{ errorMessage }}</span>
            </div>

            <button v-if="isLoading" className="submitButton ">
              <div className="submitSpinner"></div>
            </button>

            <button v-else className="submitButton ">SIGN UP</button>
          </form>

          <div
            className="text-center text-white/50 text-[18px] mt-[12px] font-semibold font-sans  "
          >
            <span>Already have account, </span>
            <span
              className="focus:underline text-orange-400 cursor-pointer"
              @click="router.push({ name: 'login' })"
            >
              Sign in
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
