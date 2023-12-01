import { computed, ref, watch } from "vue";
let getTrandingMovies = () => {
  let videoLink = ref([]);
  let videoKey = ref("");
  let error = ref(null);
  let options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjVlNmEwNzUwNThhOTczYWNkM2VjMjY2MzA5MDM3ZiIsInN1YiI6IjY1NjA0M2NkNzA2ZTU2MDBmZTAyMjI3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2S9moB5B2zhnQ9sTeNghIaA9SE5qMy_6LEuuMImXnOI",
    },
  };

  async function getVideo(link) {
    try {
      let data = await fetch(link, options);
      videoLink.value = await data.json();
    } catch (err) {
      error.value = err;
    }
    console.log(videoLink.value.results);
  }

  function getTrailar() {
    let data = [];
    if (videoLink.value.results.length) {
      videoLink.value.results.map((item) => {
        if (item.site === "YouTube" && item.type === "Trailer") {
          data = [...data, item];
        }
      });
      videoKey.value = data[0].key;
    }
  }

  watch(videoLink, () => {
    getTrailar();
    // console.log(videoKey.value);
  });
  return { videoLink, getVideo, error, videoKey };
};

export default getTrandingMovies;
