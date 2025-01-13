
import { Badge } from "./ui/badge";
import { User, Users, Video } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Actor } from "./Actors";
import { Producer } from "./Producers";
import { Movie } from "./Movies";

function MovieCard({ movie }: { movie: Movie }) {
  const [producerList, setProducerList] = useState<Producer[]>([]);
  const [actorList, setActorList] = useState<Actor[]>([]);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/producers');
        console.log('producer list: ', response.data);
        setProducerList(response.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };

    const fetchActors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/actors');
        console.log('actor list: ', response.data);
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

  return (
    <div className='flex items-center justify-center'>
      <div className=' mx-auto bg-white rounded-3xl shadow-xl'>
        <div className="grid rounded-3xl max-w-[360px] shadow-sm bg-slate-200  flex-col">
          <img
            src={movie.poster}
            width="360"
            height="200"
            className="rounded-t-3xl justify-center h-80 grid object-fill"
            alt="movie.title"
          />

          <div className="group p-5 grid z-10">
            <h2
              className=" font-bold md:text-2xl line-clamp-2"
            >
              {movie.name}
            </h2>
            <span className="text-slate-400 pt-2 font-semibold">
              {movie.yearOfRelease}
            </span>
            <div className="">
              <span className="line-clamp-4 py-2   text-sm font-light ">
                {movie.plot}
              </span>
            </div>
            <div className=" ">
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
                        <Badge
                          key={actorId}
                          variant="outline"
                        >
                          <User className="mr-1 h-3 w-3" />
                          {getActorName(actorId)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
