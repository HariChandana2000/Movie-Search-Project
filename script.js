const apiKey = "eaf390d3";
const imdbId = "tt3896198";
const url = `https://omdbapi.com/?i=${imdbId}&apikey=${apiKey}&s=`;

const moviesContainer = document.getElementById("movies-container");
const search = document.getElementById("search");

function debounceEffect(delay) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      getMovies(document.getElementById("search").value);
    }, delay);
  };
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
