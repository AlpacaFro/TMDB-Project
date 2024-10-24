const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer YOUR_API_KEY'  // Replace with your actual TMDB API key
    }
};

// Fetch trending movies
function fetchTrendingMovies() {
    return fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
        .then(res => res.json())
        .catch(err => console.error(err));
}

// Render trending movies on the homepage
function renderTrendingMovies() {
    fetchTrendingMovies().then(data => {
        const movieContainer = document.querySelector('.main-container'); // Your container where movies will be appended

        data.results.forEach(movie => {
            // Create the movie card (HTML structure)
            const movieCard = document.createElement('div');
            movieCard.classList.add('main'); // Adding the main class for styling

            // Create the image container and image element
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`; // Use the TMDB image URL
            imageDiv.appendChild(img);

            // Create the movie title element
            const titleDiv = document.createElement('div');
            titleDiv.classList.add('movie-title');
            titleDiv.textContent = movie.title; // Set the movie title from the API

            // Create the movie-mouseover element
            const mouseoverDiv = document.createElement('div');
            mouseoverDiv.classList.add('movie-mouseover');
            const movieDescription = document.createElement('p');
            movieDescription.textContent = movie.overview; // Set the movie overview/description
            mouseoverDiv.appendChild(movieDescription);

            // Add a button to the movie-mouseover (optional)
            const button = document.createElement('button');
            button.textContent = 'Movie';
            mouseoverDiv.appendChild(button);

            // Append the elements to the movie card
            movieCard.appendChild(imageDiv);
            movieCard.appendChild(titleDiv);
            movieCard.appendChild(mouseoverDiv);

            // Finally, append the movie card to the container
            movieContainer.appendChild(movieCard);
        });
    });
}

// Call the function to render the trending movies on page load
renderTrendingMovies();
