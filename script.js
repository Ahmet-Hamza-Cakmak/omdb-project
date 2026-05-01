const API_KEY = "403d3899";

// Get elements from HTML
const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const movieResult = document.getElementById("movieResult");
const message = document.getElementById("message");

// Click event → search movie
searchBtn.addEventListener("click", searchMovie);

// Allow pressing Enter to search
movieInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMovie();
  }
});

// When page loads, restore last search (localStorage)
window.addEventListener("load", function () {
  const lastMovie = localStorage.getItem("lastMovie");

  if (lastMovie) {
    movieInput.value = lastMovie;
    fetchMovie(lastMovie);
  }
});

// Main function triggered by user
function searchMovie() {
  const movieName = movieInput.value.trim(); // remove spaces

  // Prevent empty search
  if (movieName === "") {
    showMessage("Please enter a movie name.");
    return;
  }

  // Save last search
  localStorage.setItem("lastMovie", movieName);

  // Fetch movie from API
  fetchMovie(movieName);
}

// Fetch data from OMDB API
async function fetchMovie(movieName) {
  try {
    showMessage("Loading...");
    movieResult.classList.add("hidden"); // hide old result

    // Build API URL
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(movieName)}`;

    // Send request and wait for response
    const response = await fetch(url);
    const data = await response.json();

    // If movie not found
    if (data.Response === "False") {
      showMessage("Movie not found. Please try another title.");
      return;
    }

    showMessage(""); // clear message
    displayMovie(data);

  } catch (error) {
    // Network or unexpected error
    showMessage("Something went wrong. Please try again later.");
    console.error(error);
  }
}

// Display movie data on screen
function displayMovie(movie) {
  // If poster missing, use placeholder
  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster";

  // Insert HTML dynamically
  movieResult.innerHTML = `
    <img src="${poster}" alt="${movie.Title} poster" />

    <div class="movie-info">
      <h2>${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
    </div>
  `;

  // Show result
  movieResult.classList.remove("hidden");
}

// Utility function to show messages
function showMessage(text) {
  message.textContent = text;
}