import { FC, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Producer } from '../Producers';
import { Textarea } from '../ui/textarea';
import axios from 'axios';

interface AddProducerModalProps {
    openAddProducer: boolean;
    setOpenAddProducer: (open: boolean) => void;
    fetchProducers?: () => void;
}

const AddProducerModal: FC<AddProducerModalProps> = ({ openAddProducer, setOpenAddProducer, fetchProducers }) => {

    const { toast } = useToast();
    const [newProducer, setNewProducer] = useState<Producer>({
        name: "",
        dob: "",
        gender: "",
        bio: "",
    });

    const handleAddProducer = async () => {
        if (!newProducer.name || !newProducer.dob || !newProducer.gender || !newProducer.bio) {
            toast({
                description: "All fields are required.",
            });
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/producers", newProducer);
            toast({
                description: "Producer added successfully.. ✔️",
            });
            setOpenAddProducer(false);
        } catch (error) {
            console.error(error);
        } finally {
            setNewProducer({
                name: "",
                dob: "",
                gender: "",
                bio: "",
            });
            fetchProducers?.();
        }
    };

    const handleCancel = () => {
        setNewProducer({
            name: "",
            dob: "",
            gender: "",
            bio: "",
        });
        setOpenAddProducer(false);
    }
    return (
        <>{
            openAddProducer && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Producer</h2>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={newProducer.name}
                                    onChange={(e) =>
                                        setNewProducer({ ...newProducer, name: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={newProducer.dob}
                                    onChange={(e) =>
                                        setNewProducer({ ...newProducer, dob: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={newProducer.gender}
                                    onChange={(e) =>
                                        setNewProducer({ ...newProducer, gender: e.target.value })
                                    }
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    rows={4}
                                    value={newProducer.bio}
                                    onChange={(e) =>
                                        setNewProducer({ ...newProducer, bio: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleAddProducer}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddProducerModal
