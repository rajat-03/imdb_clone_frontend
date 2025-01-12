
import axios from 'axios';
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { Producer } from './Producers';
import { Actor } from './Actors';
import MovieCard from './MovieCard';


export interface Movie {
  _id?: string;
  name: string;
  yearOfRelease: string;
  plot: string;
  poster: string;
  producer: string;
  actors: string[];
}

const Movies = () => {
  const navigate = useNavigate()

  const [err, setErr] = useState("");


  const [movies, setMovies] = useState<Movie[]>([]);


  useEffect(() => {

    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/movies');
        setMovies(response.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    fetchMovies();
  }, []);


  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Movies</h1>

        <Button onClick={() => navigate("/movies/add")}>Add Movie</Button>
      </div>
      <div className="bg-gray-950 rounded-lg shadow-md overflow-hidden w-full">

        <div className="grid grid-cols-3 gap-2">
          {movies.map((movie, index) => (
            <div key={index}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

    </div>

  )
}

export default Movies