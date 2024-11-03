document.addEventListener('DOMContentLoaded', function () {
    const loadingScreen = document.getElementById('loading-screen');
    const favoritesContainer = document.getElementById('favorites-container');

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDcyNzViNjg0YzAyNzk5MDI3YmExYThhNWI5MTBhOSIsIm5iZiI6MTcyOTc2MTAyNS44MzU4Nywic3ViIjoiNjcwZTJhMWM5ZjM1MzFlNmIyNmM1YWMzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TvB9qmpBtlW23ekD8T0zqP_vHV_Q7fAxhO_w-wvfDwM'
        }
    };
    const apiUrl = 'https://api.themoviedb.org/3';

    // Hide loading screen after content is loaded
    window.addEventListener('load', () => {
        loadingScreen.classList.add('hidden');
    });

    // Load favorites from local storage
    function loadFavorites() {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>No favorite movies added yet.</p>';
            return;
        }

        favoritesContainer.innerHTML = ''; // Clear any existing content

        favorites.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('favorite-card');

            // Movie poster
            const moviePoster = document.createElement('img');
            moviePoster.src = movie.poster;
            moviePoster.alt = `${movie.title} Poster`;
            moviePoster.addEventListener('click', function () {
                window.location.href = `single-movie.html?id=${movie.id}`;
            });
            movieCard.appendChild(moviePoster);

            // Movie title
            const movieTitle = document.createElement('h3');
            movieTitle.textContent = movie.title;
            movieCard.appendChild(movieTitle);

            // Remove from favorites button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove from Favorites';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', function () {
                removeFromFavorites(movie.id);
            });
            movieCard.appendChild(removeButton);

            favoritesContainer.appendChild(movieCard);
        });
    }

    // Remove movie from favorites
    function removeFromFavorites(movieId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(movie => movie.id !== movieId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites(); // Refresh the favorites list
    }

    // Add movie to favorites
    function addToFavorites(movie) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(favMovie => favMovie.id === movie.id)) {
            favorites.push({
                id: movie.id,
                title: movie.title,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Movie added to favorites!');
        } else {
            alert('Movie is already in your favorites!');
        }
        loadFavorites();
    }

    // Initial load of favorite movies
    loadFavorites();
});
