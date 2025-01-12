import { FC, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Actor } from '../Actors';
import { Textarea } from '../ui/textarea';
import axios from 'axios';


interface AddActorModalProps {
    openAddActor: boolean;
    setOpenAddActor: (open: boolean) => void;
    fetchActors?: () => void;
}

const AddActorModal: FC<AddActorModalProps> = ({ openAddActor, setOpenAddActor, fetchActors }) => {

    const { toast } = useToast();
    const [newActor, setNewActor] = useState<Actor>({
        name: "",
        dob: "",
        gender: "",
        bio: "",
    });

    const handleAddActor = async () => {
        if (!newActor.name || !newActor.dob || !newActor.gender || !newActor.bio) {
            toast({
                description: "All fields are required.",
            });
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/actors", newActor);
            toast({
                description: "Actor added successfully.. ✔️",
            });
            setOpenAddActor(false);
        } catch (error) {
            console.error(error);
        } finally {
            setNewActor({
                name: "",
                dob: "",
                gender: "",
                bio: "",
            });
            fetchActors?.();
        }
    };

    const handleCancel = () => {
        setNewActor({
            name: "",
            dob: "",
            gender: "",
            bio: "",
        });
        setOpenAddActor(false);
    }
    return (
        <>{
            openAddActor && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Actor</h2>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={newActor.name}
                                    onChange={(e) =>
                                        setNewActor({ ...newActor, name: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={newActor.dob}
                                    onChange={(e) =>
                                        setNewActor({ ...newActor, dob: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={newActor.gender}
                                    onChange={(e) =>
                                        setNewActor({ ...newActor, gender: e.target.value })
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
                                    value={newActor.bio}
                                    onChange={(e) =>
                                        setNewActor({ ...newActor, bio: e.target.value })
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
                                <Button size="sm" onClick={handleAddActor}>
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

export default AddActorModal