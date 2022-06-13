import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {

    setIsLoading(true);
    setError(null);

    try {
      //const response = await fetch('https://swapi.py4e.com/api/films/'); 
      const response = await fetch('https://react-http-project-5df77-default-rtdb.firebaseio.com/movies.json')  
      
      //Handling we dont have data state
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      setMovies(loadedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);  

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  
  async function addMovieHandler(movie) {
      const response = await fetch('https://react-http-project-5df77-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie), // takes a JavaScript object or array and turns it JSON format.
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
  }

  let content = <p>Found no movies.</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies}/>
  }

  if (error) {
    content = <p>{error}</p>
  }

  if (isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>No Movies Found</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>} */}
        {content}
        
      </section>
    </React.Fragment>
  );
}

export default App;
