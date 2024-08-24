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

async function showMoreDetails(movieTitle) {
  const url = `https://omdbapi.com/?i=${imdbId}&apikey=${apiKey}&t=${movieTitle}`;
  const response = await fetch(url);
  const data = await response.json();

  const modalBg = document.createElement("div");
  modalBg.className = "modal-bg";
  modalBg.style.display = "block";

  const card = document.createElement("div");
  const poster = document.createElement("img");
  const title = document.createElement("h3");
  const list = document.createElement("ul");
  const button = document.createElement("button");

  card.className = "modal-card";
  button.innerText = "Close";
  button.className = "show-details";

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
  title.innerText = data.Title;

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
