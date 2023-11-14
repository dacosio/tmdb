// *****************************************************************************
// Path to the Movie Poster
const imgPath = "https://image.tmdb.org/t/p/w200";
let movieData = [];

// Initial fetch
fetch("http://localhost:3000")
  .then((response) => response.json())
  .then((data) => {
    movieData = data;
    displayMovies(movieData);
  });

// *****************************************************************************
// *****************************************************************************

// Function to display movies
function displayMovies(movies) {
  const movieTableBody = document.getElementById("movieTableBody");
  movieTableBody.innerHTML = ""; // Clear existing content

  const rowCount = movieTableBody.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    movieTableBody.deleteRow(i);
  }

  for (let i = 0; i < movies.length; i++) {
    const movieRow = movieTableBody.insertRow(i);
    movieRow.setAttribute("data-id", movies[i].id);

    const cell1 = movieRow.insertCell(0);
    const cell2 = movieRow.insertCell(1);
    const cell3 = movieRow.insertCell(2);
    const cell4 = movieRow.insertCell(3);
    const cell5 = movieRow.insertCell(4); // New cell for "Favorite" button

    cell1.innerHTML = movies[i].title;
    cell2.innerHTML = movies[i].release_date;
    cell3.innerHTML = movies[i].vote_average;
    cell4.innerHTML = `<input type="checkbox" class="movieItems" id="movies${
      i + 1
    }" value="${i}" />`;

    // Add "Favorite" button
    const favoriteButton = document.createElement("button");
    favoriteButton.innerText = "Favorite";
    favoriteButton.addEventListener("click", () => addToFavorites(movies[i]));
    cell5.appendChild(favoriteButton);
  }
}

// Processing the Triggered Event
getDetails.addEventListener("click", () => {
  movieDetails.innerHTML = "";
  const allMovies = document.querySelectorAll(".movieItems");

  for (let i = 0; i < allMovies.length; i++) {
    if (allMovies[i].checked) {
      // Setup the Information Section
      const newDiv = document.createElement("div");
      newDiv.className = "movieBlock";

      // Add the Heading
      const divHeader = document.createElement("h2");
      const divHeaderText = document.createTextNode(
        `${movieData[allMovies[i].value].title}`
      );
      divHeader.appendChild(divHeaderText);
      newDiv.appendChild(divHeader);
      console.log(divHeaderText);
      // Add Description Container
      const descriptionContainer = document.createElement("div");
      descriptionContainer.className = "descriptionContainer";

      // Add the Image to the Description Container
      const movieImage = document.createElement("img");
      const imagePath = `${
        imgPath + movieData[allMovies[i].value].poster_path
      }`;
      const imageAlt = `${movieData[allMovies[i].value].title}`;
      movieImage.setAttribute("src", imagePath);
      movieImage.setAttribute("alt", imageAlt);

      // Create a Text Container to add to the Description Container
      const movieText = document.createElement("div");
      movieText.className = "textDescription";

      // Add the Movie Description to the Text Container
      const movieDescription = document.createElement("div");
      const description = document.createTextNode(
        `${movieData[allMovies[i].value].overview}`
      );
      movieDescription.appendChild(description);
      movieText.appendChild(movieDescription);

      // Add the Rating to the Text Container
      const movieRating = document.createElement("div");
      const rating = document.createTextNode(
        `Rated ${movieData[allMovies[i].value].vote_average} averaged over ${
          movieData[allMovies[i].value].vote_count
        } voters`
      );
      movieRating.appendChild(rating);
      movieText.appendChild(movieRating);

      // Put it all together
      descriptionContainer.appendChild(movieImage);
      descriptionContainer.appendChild(movieText);
      newDiv.appendChild(descriptionContainer);
      movieDetails.appendChild(newDiv);
    }
  }
});

// Process search term

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// click event listener to the search button
searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.toLowerCase();

  fetch(`http://localhost:3000/search?movieName=${searchTerm}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the search results data
      movieData = data;
      displayMovies(data); // Display search results using the same function
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
    });
});

function addToFavorites(movie) {
  const favoriteTableBody = document.getElementById("favoriteTableBody");

  // Check if the movie is already in the favorites table
  const isDuplicate = Array.from(favoriteTableBody.rows).some(
    (row) => row.cells[0].innerHTML === movie.title
  );

  if (!isDuplicate) {
    // Create a new row in the favorites table
    const favoriteRow = favoriteTableBody.insertRow(
      favoriteTableBody.rows.length
    );

    // Populate cells in the favorites table
    const cell1 = favoriteRow.insertCell(0);
    const cell2 = favoriteRow.insertCell(1);
    const cell3 = favoriteRow.insertCell(2);
    const cell4 = favoriteRow.insertCell(3); // New cell for "Remove Favorite" button

    cell1.innerHTML = movie.title;
    cell2.innerHTML = movie.release_date;
    cell3.innerHTML = movie.vote_average;

    // Create "Remove Favorite" button
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove Favorite";
    removeButton.addEventListener("click", () =>
      removeFromFavorites(movie, favoriteRow)
    );
    cell4.appendChild(removeButton);

    // Send a POST request to add the movie to favorites
    const url = "http://localhost:3000/favorite";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mediaId: movie.id,
        isFavorite: true,
      }),
    };
    fetch(url, options)
      .then((response) => response.json())
      .catch((error) => console.error("Error adding to favorites:", error));
  } else {
    alert("This movie is already in your favorites!");
  }
}

function removeFromFavorites(movie, row) {
  const favoriteTableBody = document.getElementById("favoriteTableBody");

  // Check if the movie is in the favorites table
  const isPresent = Array.from(favoriteTableBody.rows).some(
    (r) => r.cells[0].innerHTML === movie.title
  );

  if (isPresent) {
    // Send a POST request to remove the movie from favorites
    const url = "http://localhost:3000/favorite";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mediaId: movie.id,
        isFavorite: false, // Set to false since it's being removed from favorites
      }),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((json) => {
        // Remove the row from the favorites table
        row.parentNode.removeChild(row);
      })
      .catch((error) => console.error("Error removing from favorites:", error));
  } else {
    alert("This movie is not in your favorites!");
  }
}

// Function to display favorite movies
function displayFavorites(favoriteMovies) {
  const favoriteTableBody = document.getElementById("favoriteTableBody");
  favoriteTableBody.innerHTML = ""; // Clear existing content

  for (let i = 0; i < favoriteMovies.length; i++) {
    const favoriteRow = favoriteTableBody.insertRow(i);

    const cell1 = favoriteRow.insertCell(0);
    const cell2 = favoriteRow.insertCell(1);
    const cell3 = favoriteRow.insertCell(2);
    const cell4 = favoriteRow.insertCell(3); // New cell for "Remove Favorite" button

    cell1.innerHTML = favoriteMovies[i].title;
    cell2.innerHTML = favoriteMovies[i].release_date;
    cell3.innerHTML = favoriteMovies[i].vote_average;

    // Create "Remove Favorite" button
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove Favorite";
    removeButton.addEventListener("click", () =>
      removeFromFavorites(favoriteMovies[i], favoriteRow)
    );
    cell4.appendChild(removeButton);
  }
}
fetch("http://localhost:3000/favorite")
  .then((response) => response.json())
  .then((data) => {
    displayFavorites(data);
  })
  .catch((error) => {
    console.error("Error fetching favorite movies:", error);
  });
