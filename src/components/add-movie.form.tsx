import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    // Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Producer } from './Producers';
import Select from 'react-select';
import { Actor } from './Actors';

export default function AddMovieForm() {
    const [selectedActors, setSelectedActors] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [producerList, setProducerList] = useState<Producer[]>([]);
    const [actorList, setActorList] = useState<Actor[]>([]);
    const [selectedProducer, setSelectedProducer] = useState('');

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        const reader = new FileReader();
        reader.onloadend = function () {
            setPreview(reader.result as string);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        if (preview) {
            formData.set('poster', preview);
        }
        const data = {
            name: formData.get('name'),
            year: formData.get('year'),
            plot: formData.get('plot'),
            poster: formData.get('poster'),
            producer: selectedProducer, // Use the selected producer state
            actors: selectedActors,
        };
        console.log(data);
        try {
            // await axios.post('http://localhost:8000/api/movies', data);
        } catch (error) {
            console.log('error: ', error);
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
                            <Input id="name" name="name" required />
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
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plot">Plot</Label>
                            <Textarea
                                id="plot"
                                name="plot"
                                required
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
                                required
                                onChange={handleFileUpload}
                            />
                            {preview && (
                                <img src={preview} alt="Poster Preview" className="mt-2 max-h-64" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="producer">Producer</Label>
                            <Select
                                name="producer"
                                options={producerOptions}
                                value={producerOptions.find(option => option.value === selectedProducer)}
                                onChange={(option) => setSelectedProducer(option?.value || '')}
                                isClearable
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="actors">Actors</Label>
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
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Create Movie
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
