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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

function MovieCard({ movie, fetchMovies }: { movie: Movie, fetchMovies: () => void }) {
  const [producerList, setProducerList] = useState<Producer[]>([]);
  const [actorList, setActorList] = useState<Actor[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await axios.get('https://imdb-clone-backend-971u.onrender.com/api/producers');
        setProducerList(response.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    const fetchActors = async () => {
      try {
        const response = await axios.get('https://imdb-clone-backend-971u.onrender.com/api/actors');
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
    setMovieToDelete(movieId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMovie = async () => {
    if (movieToDelete) {
      try {
        await axios.delete(`https://imdb-clone-backend-971u.onrender.com/api/movies/${movieToDelete}`);
        toast({
          variant: "dark",
          description: "Movie deleted successfully.. ✔️",
        });
        fetchMovies();
      } catch (error) {
        toast({
          variant: "dark",
          description: "Error deleting movie.. ❌",
        });
        console.log(error);
      } finally {
        setShowDeleteDialog(false);
        setMovieToDelete(null);
      }
    }
  };

  const handleEditMovie = (movieId: string) => {
    navigate("/movies/add", { state: { movieId } });
  };

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
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEditMovie(movie._id!)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteMovie(movie._id!)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the movie from your collection.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMovie}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MovieCard;
