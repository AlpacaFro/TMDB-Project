const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDcyNzViNjg0YzAyNzk5MDI3YmExYThhNWI5MTBhOSIsIm5iZiI6MTcyOTc2MTAyNS44MzU4Nywic3ViIjoiNjcwZTJhMWM5ZjM1MzFlNmIyNmM1YWMzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TvB9qmpBtlW23ekD8T0zqP_vHV_Q7fAxhO_w-wvfDwM'
    }
  };

  const dailyContainer = document.querySelector('.main-container-daily');
  const weeklyContainer = document.querySelector('.main-container-weekly');
  const toggleSwitch = document.getElementById('toggleSwitch');
  const searchInput = document.getElementById('search');
  const dropdown = document.getElementById('dropdown');
  
// Fetch daily movies
function fetchTrendingMovies() {
    return fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
        .then(res => res.json())
        .catch(err => console.error(err));
}

// Fetch weekly movies
function fetchPopularMovies() {
    return fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
        .then(res => res.json())
        .catch(err => console.error(err));
}

// Fetch search results 
function fetchSearchResults(query) {
    return fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`, options)
        .then(res => res.json())
        .catch(err => console.error(err));
}

// render daily on load 
renderMovies(fetchTrendingMovies, dailyContainer);

// Toggle between daily and weekly Movies
toggleSwitch.addEventListener('change', function () {
    if (toggleSwitch.checked) {
        dailyContainer.style.display = 'none';
        weeklyContainer.style.display = 'block';
        renderMovies(fetchPopularMovies, weeklyContainer);
    } else {
        weeklyContainer.style.display = 'none';
        dailyContainer.style.display = 'block';
        renderMovies(fetchTrendingMovies, dailyContainer);
    }
});

// Render movies
function renderMovies(fetchFunc, movieContainer) {
    fetchFunc().then(data => {
        movieContainer.innerHTML = ''; 

        data.results.forEach(movie => {
            // Create movie card
            const movieCard = document.createElement('div');
            movieCard.classList.add('main');

            // Create image container and movie image
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image');
            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            img.alt = movie.title;
            imageDiv.appendChild(img);

            // Create movie title
            const titleDiv = document.createElement('div');
            titleDiv.classList.add('movie-title');
            titleDiv.textContent = movie.title;

            // Create movie-mouseover 
            const mouseoverDiv = document.createElement('div');
            mouseoverDiv.classList.add('movie-mouseover');
            const movieDescription = document.createElement('p');
            movieDescription.textContent = movie.overview;
            mouseoverDiv.appendChild(movieDescription);
            const button = document.createElement('button');
            button.textContent = 'Movie';
            mouseoverDiv.appendChild(button);

            // Append elements to the movie card
            movieCard.appendChild(imageDiv);
            movieCard.appendChild(titleDiv);
            movieCard.appendChild(mouseoverDiv);

            // Append the movie card to the container
            movieContainer.appendChild(movieCard);
        });
    }).catch(err => console.error('Error rendering movies:', err));
}


function updateDropdown(results) {
    dropdown.innerHTML = ''; // Clear previous results
    dropdown.style.display = 'block'; // Show the dropdown

    // Limit results to 10 movies
    const limitedResults = results.slice(0, 10);

    // Append each result to the dropdown
    limitedResults.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.classList.add('dropdown-item');

        // Movie title
        const movieTitle = document.createElement('span');
        movieTitle.textContent = movie.title;

        // Movie poster
        const movieImage = document.createElement('img');
        movieImage.src = `https://image.tmdb.org/t/p/w92${movie.poster_path}`; // Use a small size image (w92)
        movieImage.alt = movie.title;
        movieImage.classList.add('movie-poster');

        // Append title and image to the list item
        listItem.appendChild(movieTitle);
        listItem.appendChild(movieImage);

        // Add event listener for movie selection
        listItem.addEventListener('click', () => selectMovie(movie));

        dropdown.appendChild(listItem);
    });
}

// Handle movie selection from the dropdown
function selectMovie(movie) {
    alert(`You selected: ${movie.title}`); // You can replace this with custom behavior
    dropdown.style.display = 'none'; // Hide dropdown after selection
}

// Add event listener to search input
searchInput.addEventListener('input', function() {
    const query = searchInput.value.trim();

    if (query.length > 2) { // Only search when query has more than 2 characters
        fetchSearchResults(query).then(data => {
            if (data.results && data.results.length > 0) {
                updateDropdown(data.results);
            } else {
                dropdown.innerHTML = '<li>No results found</li>';
            }
        });
    } else {
        dropdown.style.display = 'none'; // Hide dropdown if query is too short
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target) && !searchInput.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});
