document.addEventListener('DOMContentLoaded', function () {
    const loadingScreen = document.getElementById('loading-screen');
    const movieId = new URLSearchParams(window.location.search).get('id');
    const moviePoster = document.getElementById('movie-poster');
    const movieTitle = document.getElementById('movie-title');
    const movieDescription = document.getElementById('movie-description');
    const movieCategories = document.getElementById('movie-categories');
    const movieActors = document.getElementById('movie-actors');
    const addToFavoritesButton = document.getElementById('add-to-favorites-button');
    const searchInput = document.getElementById('search');
    const dropdown = document.getElementById('dropdown');

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDcyNzViNjg0YzAyNzk5MDI3YmExYThhNWI5MTBhOSIsIm5iZiI6MTcyOTc2MTAyNS44MzU4Nywic3ViIjoiNjcwZTJhMWM5ZjM1MzFlNmIyNmM1YWMzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TvB9qmpBtlW23ekD8T0zqP_vHV_Q7fAxhO_w-wvfDwM'
        }
    };

    if (!movieId) {
        console.error("No movie ID provided in the URL.");
        return;
    }

    // Hide loading screen after content is loaded
    window.addEventListener('load', () => {
        loadingScreen.classList.add('hidden');
    });

    // Fetch movie details using the movie ID
    function fetchMovieDetails() {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayMovieDetails(data);
                toggleFavoritesButton(); // Check if movie is already in favorites
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    // Function to display movie details
    function displayMovieDetails(data) {
        if (!data || !data.title) {
            console.error("Invalid data received for the requested movie.");
            return;
        }
        moviePoster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        moviePoster.alt = `${data.title} Poster`;
        movieTitle.textContent = data.title;
        movieDescription.textContent = data.overview;
        movieCategories.textContent = data.genres.map(genre => genre.name).join(", ");
        movieActors.textContent = "Actor details not available."; // Placeholder since TMDB API requires a different call for actors
    }

    // Function to toggle the Add to Favorites button
    function toggleFavoritesButton() {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.some(movie => movie.id === movieId)) {
            addToFavoritesButton.textContent = 'Remove from Favorites';
            addToFavoritesButton.classList.add('toggled');
        } else {
            addToFavoritesButton.textContent = 'Add to Favorites';
            addToFavoritesButton.classList.remove('toggled');
        }
    }

    // Add to Favorites Button Logic
    addToFavoritesButton.addEventListener('click', function () {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favoriteMovie = {
            id: movieId,
            title: movieTitle.textContent,
            poster: moviePoster.src
        };

        if (favorites.some(movie => movie.id === movieId)) {
            // Remove from favorites
            favorites = favorites.filter(movie => movie.id !== movieId);
            alert('Movie removed from favorites.');
        } else {
            // Add to favorites
            favorites.push(favoriteMovie);
            alert('Movie added to favorites!');
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        toggleFavoritesButton();
    });

    // Search Functionality
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();
        if (query.length > 2) {
            fetchSearchResults(query);
        } else {
            dropdown.style.display = 'none';
        }
    });

    // Fetch search results
    function fetchSearchResults(query) {
        fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`, options)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    updateDropdown(data.results);
                } else {
                    dropdown.innerHTML = '<li>No results found</li>';
                    dropdown.style.display = 'block';
                }
            })
            .catch(err => console.error('Error fetching search results:', err));
    }

    // Update dropdown with search results
    function updateDropdown(results) {
        dropdown.innerHTML = '';
        dropdown.style.display = 'block';
        results.slice(0, 10).forEach(movie => {
            const listItem = document.createElement('li');
            listItem.classList.add('dropdown-item');
            listItem.innerHTML = `${movie.title} <img src="https://image.tmdb.org/t/p/w92${movie.poster_path}" alt="${movie.title} Poster" class="dropdown-poster"> `;
            listItem.addEventListener('click', () => {
                window.location.href = `single-movie.html?id=${movie.id}`;
            });
            dropdown.appendChild(listItem);
        });
    }

    // Initial call to fetch movie details
    fetchMovieDetails();
});
