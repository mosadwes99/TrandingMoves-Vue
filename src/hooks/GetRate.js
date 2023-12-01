import { ref } from "vue";
let getTrandingMovies = () => {
  let rate = ref("");
  let error = ref(null);
  let options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "8f20be50damsh7269fdca4d7781bp107c56jsn688d725862fc",
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  async function getRate(id) {
    try {
      let data = await fetch(
        `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${id}`,
        options
      );
      rate.value = await data.json();
    } catch (err) {
      error.value = err;
    }
  }
  return { rate, getRate, error };
};

export default getTrandingMovies;
