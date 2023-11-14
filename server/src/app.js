const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const port = process.env.PORT || 3000;
const apiURL = "https://api.themoviedb.org/3";
const apiKey = "&api_key=2b8ae5af818b4145f34d48e0264179f9&page=1";
const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjhhZTVhZjgxOGI0MTQ1ZjM0ZDQ4ZTAyNjQxNzlmOSIsInN1YiI6IjYyYjhmMTEwZTFmYWVkMGI4MTE3NzFhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qoEG-px9xzL2SYIl3K1g8F1H4VUsjGFBpXsSRSv2-fk";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoints
app.get("/", getPopularMovies);
app.get("/search", searchMovies);
app.post("/favorite", manageFavorites);
app.get("/favorite", getFavoriteMovies);

// Function to fetch movies from the Movie Database API
async function fetchMovies(endpoint) {
  const response = await fetch(apiURL + endpoint + apiKey);
  return response.json();
}

// Function to handle the "/favorite" endpoint
async function manageFavorites(req, res) {
  try {
    const { mediaId, isFavorite } = req.body;
    const url = "https://api.themoviedb.org/3/account/12901691/favorite";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: mediaId,
        favorite: isFavorite,
      }),
    };

    const response = await fetch(url, options);
    const json = await response.json();
    res.send(json);
  } catch (error) {
    console.error("Error managing favorites:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// Function to handle the "/" endpoint
async function getPopularMovies(req, res) {
  try {
    const data = await fetchMovies("/discover/movie?sort_by=popularity.desc");
    res.send(data.results);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// Function to handle the "/search" endpoint
async function searchMovies(req, res) {
  try {
    const { movieName } = req.query;
    const apiSearch = `/search/movie?query=${movieName}&include_adult=false&language=en-US`;
    const data = await fetchMovies(apiSearch);
    res.send(data.results);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// Function to handle the "/favorite" endpoint
async function getFavoriteMovies(req, res) {
  try {
    const data = await fetchFavoriteMovies();
    res.send(data.results);
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// Function to fetch favorite movies
async function fetchFavoriteMovies() {
  const url =
    "https://api.themoviedb.org/3/account/12901691/favorite/movies?language=en-US&page=1&sort_by=created_at.asc";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, options);
  return response.json();
}

app.listen(port, () => {
  console.log(`Server is up and running at port ${port}`);
});
