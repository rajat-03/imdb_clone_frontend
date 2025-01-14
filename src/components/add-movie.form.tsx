import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Producer } from './Producers';
import Select from 'react-select';
import { Actor } from './Actors';
import AddActorModal from './modals/AddActorModal';
import { useToast } from '@/hooks/use-toast';
import AddProducerModal from './modals/AddProducerModal';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddMovieForm() {
    const [movieName, setMovieName] = useState('');
    const [yearOfRelease, setYearOfRelease] = useState('');
    const [plot, setPlot] = useState('');
    const [poster, setPoster] = useState<string | null>(null);
    const [selectedActors, setSelectedActors] = useState<string[]>([]);
    const [selectedProducer, setSelectedProducer] = useState('');
    const [producerList, setProducerList] = useState<Producer[]>([]);
    const [actorList, setActorList] = useState<Actor[]>([]);
    const [openAddActor, setOpenAddActor] = useState(false);
    const [openAddProducer, setOpenAddProducer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state;

    // For update: Fetch movie details
    const fetchMovieDetailById = async () => {
        try {
            const response = await axios.get(`https://imdb-clone-backend-971u.onrender.com/api/movies/${state.movieId}`);
            const movieData = response.data;

            // Prefill the form with movie details
            setMovieName(movieData.name);
            setYearOfRelease(movieData.yearOfRelease);
            setPlot(movieData.plot);
            setPoster(movieData.poster);
            setSelectedProducer(movieData.producer);
            setSelectedActors(movieData.actors.map((actorId: string) => actorId));
        } catch (error) {
            console.log('error: ', error);
        }
    };

    useEffect(() => {
        if (state?.movieId) {
            fetchMovieDetailById();
        }
        fetchProducers();
        fetchActors();
    }, [state?.movieId]);

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setPoster(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (!movieName || !yearOfRelease || !plot || !poster || !selectedProducer || selectedActors.length === 0) {
            toast({
                variant: "dark",
                description: "All fields are required.",
            });
            setIsLoading(false);
            return;
        }

        const data = {
            name: movieName,
            yearOfRelease,
            plot,
            poster,
            producer: selectedProducer,
            actors: selectedActors,
        };

        try {
            if (state?.movieId) {
                // Update existing movie
                await axios.put(`https://imdb-clone-backend-971u.onrender.com/api/movies/${state.movieId}`, data);
                toast({
                    variant: "dark",

                    description: "Movie updated successfully.",
                });
            } else {
                // Add new movie
                await axios.post('https://imdb-clone-backend-971u.onrender.com/api/movies', data);
                toast({
                    variant: "dark",
                    description: "Movie added successfully.",
                });
            }
            navigate("/");
        } catch (error) {
            console.log('error: ', error);
            toast({
                variant: "dark",
                description: "Failed to save movie.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const producerOptions = producerList.map((producer) => ({
        value: producer._id,
        label: producer.name,
    }));

    const actorsOptions = actorList
        .filter((actor) => actor._id !== undefined)
        .map((actor) => ({
            value: actor._id as string,
            label: actor.name,
        }));

    return (
        <div className='pt-6'>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{state?.movieId ? 'Update Movie' : 'Add New Movie'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Movie Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={movieName}
                                onChange={(e) => setMovieName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year of Release</Label>
                            <Select
                                name="year"
                                options={Array.from({ length: 136 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return { value: year.toString(), label: year.toString() };
                                })}
                                value={{ label: yearOfRelease, value: yearOfRelease }}
                                onChange={(option) => setYearOfRelease(option?.value || '')}
                                placeholder="Select year"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plot">Plot</Label>
                            <Textarea
                                id="plot"
                                name="plot"
                                className="min-h-[100px]"
                                value={plot}
                                onChange={(e) => setPlot(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="poster">Movie Poster</Label>
                            <Input
                                id="poster"
                                name="poster"
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            {poster && (
                                <img src={poster} alt="Poster Preview" className="mt-2 max-h-64" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="producer">Producer</Label>
                            <div className='flex space-x-2 w-full'>
                                <Select
                                    name="producer"
                                    options={producerOptions}
                                    value={producerOptions.find(option => option.value === selectedProducer)}
                                    onChange={(option) => setSelectedProducer(option?.value || '')}
                                    className='w-full'
                                />
                                <Button type="button" onClick={() => setOpenAddProducer(true)}>Add New Producer</Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="actors">Actors</Label>
                            <div className='flex space-x-2 w-full'>
                                <Select
                                    isMulti
                                    name="actors"
                                    options={actorsOptions}
                                    value={selectedActors.map((actorId) => ({
                                        value: actorId,
                                        label: actorList.find((actor) => actor._id === actorId)?.name || '',
                                    }))}
                                    onChange={(selectedOptions) =>
                                        setSelectedActors(selectedOptions.map((option) => option.value))
                                    }
                                    isSearchable
                                    className="w-full"
                                />
                                <Button type="button" onClick={() => setOpenAddActor(true)}>Add New Actor</Button>
                            </div>
                        </div>


                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Saving...' : state?.movieId ? 'Update Movie' : 'Add Movie'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <AddActorModal
                openAddActor={openAddActor}
                setOpenAddActor={setOpenAddActor}
                fetchActors={fetchActors}
            />
            <AddProducerModal
                openAddProducer={openAddProducer}
                setOpenAddProducer={setOpenAddProducer}
                fetchProducers={fetchProducers}
            />
        </div>
    );
}
