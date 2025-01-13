import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { User, Users, Video, Trash2, Edit } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Actor } from "./Actors";
import { Producer } from "./Producers";
import { Movie } from "./Movies";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function MovieCard({ movie, fetchMovies }: { movie: Movie, fetchMovies: () => void }) {
  const [producerList, setProducerList] = useState<Producer[]>([]);
  const [actorList, setActorList] = useState<Actor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/producers');
        setProducerList(response.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    const fetchActors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/actors');
        setActorList(response.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    fetchProducers();
    fetchActors();
  }, []);

  const getProducerName = (producerId: string) => {
    const producer = producerList.find(p => p._id === producerId);
    return producer ? producer.name : 'Unknown Producer';
  };

  const getActorName = (actorId: string) => {
    const actor = actorList.find(a => a._id === actorId);
    return actor ? actor.name : 'Unknown Actor';
  };

  const handleDeleteMovie = async (movieId: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/movies/${movieId}`);
      toast({
        description: "Movie deleted successfully.. ✔️",
      });
      fetchMovies()
    } catch (error) {
      toast({
        description: "Error deleting movie.. ❌",
      });
      console.log(error);
    }


  }

  const handleEditMovie = (movieId: string) => {
    navigate("/movies/add", { state: { movieId } });
  }

  return (
    <div className='flex items-center justify-center'>
      <div className=' mx-auto bg-white rounded-3xl shadow-xl'>
        <div className="group rounded-3xl max-w-[360px] shadow-sm bg-slate-200 flex-col">
          <img
            src={movie.poster}
            width="360"
            height="200"
            className="rounded-t-3xl justify-center h-80 grid object-fill"
            alt="movie.title"
          />

          <div className="group p-5 grid z-10 relative">
            <h2 className="font-bold md:text-2xl line-clamp-2">
              {movie.name}
            </h2>
            <span className="text-slate-400 pt-2 font-semibold">
              {movie.yearOfRelease}
            </span>
            <div className="">
              <span className="line-clamp-4 py-2 text-sm font-light">
                {movie.plot}
              </span>
            </div>
            <div className="">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 opacity-70" />
                  <span className="text-muted-foreground">Producer:</span>
                  <span>{getProducerName(movie.producer)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 opacity-70 mt-1" />
                  <div>
                    <span className="text-muted-foreground">Cast:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.actors.map((actorId: string) => (
                        <Badge key={actorId} variant="outline">
                          <User className="mr-1 h-3 w-3" />
                          {getActorName(actorId)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-2 bottom-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={ ()=> handleEditMovie(movie._id!)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteMovie(movie._id!)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
