const apiKey = "eaf390d3";
const imdbId = "tt3896198";
const url = `https://omdbapi.com/?i=${imdbId}&apikey=${apiKey}&s=`;

const moviesContainer = document.getElementById("movies-container");
const search = document.getElementById("search");
const body = document.getElementById("body");

function debounceEffect(delay) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      getMovies(document.getElementById("search").value);
    }, delay);
  };
}

async function getTrailer(imdbId) {
  const url = `https://ott-details.p.rapidapi.com/getadditionalDetails?imdbid=${imdbId}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "3ca895565emshe3431b6ea04373ep1d4dbbjsncb4ccf32ba06",
      "x-rapidapi-host": "ott-details.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (data.trailerUrl.length === 0) return "not found";
    return data.trailerUrl[0];
  } catch (e) {
    return "not found";
  }
}

async function showMoreDetails(movieTitle) {
  const url = `https://omdbapi.com/?i=${imdbId}&apikey=${apiKey}&t=${movieTitle}`;
  const response = await fetch(url);
  const data = await response.json();
  const loadingText = document.createElement("h2");
  loadingText.innerText = "Loading...";
  loadingText.className = "loading";
  body.appendChild(loadingText);

  setTimeout(async () => {
    body.removeChild(loadingText);
    const trailerSrc = await getTrailer(data.imdbID);

    const modalBg = document.createElement("div");
    modalBg.className = "modal-bg";
    modalBg.style.display = "block";

    const card = document.createElement("div");
    const poster = document.createElement("img");
    const title = document.createElement("h3");
    const linkToImdb = document.createElement("a");
    const list = document.createElement("ul");
    const button = document.createElement("button");

    card.className = "modal-card";
    button.innerText = "Close";
    button.className = "show-details";
    linkToImdb.href = trailerSrc;
    linkToImdb.target = "_blank";
    linkToImdb.innerText = `${data.Title} (👈Trailer Link!)`;

    for (const key in data) {
      if (
        key === "Poster" ||
        key === "Title" ||
        key === "Ratings" ||
        key === "Response" ||
        key === "imdbID" ||
        data[key] === "N/A"
      )
        continue;
      const li = document.createElement("li");
      li.innerText = `${key}: ${data[key]}`;
      list.appendChild(li);
    }

    poster.src = data.Poster;
    if (trailerSrc !== "not found") title.appendChild(linkToImdb);
    else title.innerText = data.Title;

    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(list);
    card.appendChild(button);

    modalBg.appendChild(card);

    body.appendChild(modalBg);
    console.log(data);

    button.addEventListener("click", () => {
      body.removeChild(modalBg);
    });
  }, 2000);
}

async function getMovies(searchTitle = "marvel") {
  if (searchTitle === "") searchTitle = "marvel";
  const response = await fetch(url + searchTitle);
  const data = await response.json();

  console.log(searchTitle);
  moviesContainer.innerHTML = "";

  if (data.Response === "False") {
    const errorMessage = document.createElement("p");
    errorMessage.innerText = data.Error;
    moviesContainer.appendChild(errorMessage);
    return;
  }

  data.Search.forEach((movie) => {
    if (movie.Poster !== "N/A") {
      const card = document.createElement("div");
      const poster = document.createElement("img");
      const title = document.createElement("h3");
      const year = document.createElement("p");
      const button = document.createElement("button");

      poster.src = movie.Poster;
      title.innerText = movie.Title;
      button.innerText = "More Details";
      year.innerText = `Year: ${movie.Year}`;
      button.className = "show-details";

      button.addEventListener("click", (e) => showMoreDetails(movie.Title));

      card.className = "movie-card";
      title.className = "movie-title";

      card.appendChild(poster);
      card.appendChild(title);
      card.appendChild(button);
      card.appendChild(year);
      moviesContainer.appendChild(card);
    }
  });
}

let searchBoxFunction = debounceEffect(2000);

window.onload = getMovies();
