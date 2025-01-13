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

export default function AddMovieForm() {
    const [selectedActors, setSelectedActors] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [producerList, setProducerList] = useState<Producer[]>([]);
    const [actorList, setActorList] = useState<Actor[]>([]);
    const [selectedProducer, setSelectedProducer] = useState('');
    const [openAddActor, setOpenAddActor] = useState(false);
    const [openAddProducer, setOpenAddProducer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();


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

    useEffect(() => {

        fetchProducers();
        fetchActors();
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        if (preview) {
            formData.set('poster', preview);
        }
        const data = {
            name: formData.get('name'),
            yearOfRelease: formData.get('year'),
            plot: formData.get('plot'),
            poster: formData.get('poster'),
            producer: selectedProducer,
            actors: selectedActors,
        };

        if (!data.name || !data.yearOfRelease || !data.plot || !data.poster || !data.producer || data.actors.length === 0) {
            toast({
                description: "All fields are required.",
            });
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/movies', data);
            toast({
                description: "Movie added successfully.",
            });
        } catch (error) {
            console.log('error: ', error);
            toast({
                description: "Failed to add movie.",
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
                    <CardTitle>Add New Movie</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Movie Name</Label>
                            <Input id="name" name="name" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year of Release</Label>
                            <Select
                                name="year"
                                options={Array.from({ length: 136 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return { value: year.toString(), label: year.toString() };
                                })}
                                placeholder="Select year"
                                className='border-red-500'
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plot">Plot</Label>
                            <Textarea
                                id="plot"
                                name="plot"
                                className="min-h-[100px]"
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
                            {preview && (
                                <img src={preview} alt="Poster Preview" className="mt-2 max-h-64" />
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
                            {isLoading ? 'Adding...' : 'Add Movie'}
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
