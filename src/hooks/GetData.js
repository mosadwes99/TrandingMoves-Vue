import { ref } from "vue";
let getTrandingMovies = () => {
  let content = ref([]);
  let error = ref(null);
  let options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjVlNmEwNzUwNThhOTczYWNkM2VjMjY2MzA5MDM3ZiIsInN1YiI6IjY1NjA0M2NkNzA2ZTU2MDBmZTAyMjI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2S9moB5B2zhnQ9sTeNghIaA9SE5qMy_6LEuuMImXnOI",
    },
  };

  async function getData(link) {
    try {
      let data = await fetch(link, options);
      content.value = await data.json();
    } catch (err) {
      error.value = err;
    }
    // console.log(content.value);
  }
  return { content, getData, error };
};

export default getTrandingMovies;
