import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Actor } from '../Actors';
import axios from 'axios';
import { Textarea } from '../ui/textarea';

interface UpdateActorModalProps {
    openUpdateActorDetail: boolean;
    setOpenUpdateActorDetail: (open: boolean) => void;
    actorId: string;
    fetchActors: () => void;
}

const UpdateActorModal: React.FC<UpdateActorModalProps> = ({ openUpdateActorDetail, setOpenUpdateActorDetail, actorId, fetchActors }) => {

    const [editingActor, setEditingActor] = useState<Actor>({
        name: "",
        dob: "",
        gender: "",
        bio: "",
    });

    const fetchActorDetails = async (actorId: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/actors/${actorId}`);
            setEditingActor(response.data);
        } catch (error: any) {
            console.error("Error fetching actor details:", error);
        }
    }

    useEffect(() => {
        if (actorId) { // Ensure actorId is valid
            fetchActorDetails(actorId);
        }
    }, [actorId]); // Include actorId in the dependency array

    const handleUpdateActor = async () => {
        try {
            await axios.put(`http://localhost:8000/api/actors/${actorId}`, editingActor);
            toast({
                description: "Actor updated successfully.. ✔️",
            });
            fetchActors();
            setOpenUpdateActorDetail(false);
        } catch (error) {
            toast({
                description: "Error updating actor.. ❌",
            });
            console.error("Error updating actor:", error);
        }
    };

    const handleCancelClick = () => {
        setEditingActor({
            name: "",
            dob: "",
            gender: "",
            bio: "",
        });
        setOpenUpdateActorDetail(false);
    }

    const { toast } = useToast();

    return (
        <>{openUpdateActorDetail &&
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Edit Actor</h2>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={editingActor.name || ""}
                                onChange={(e) =>
                                    setEditingActor({
                                        ...editingActor,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                value={editingActor.dob || ""}
                                onChange={(e) =>
                                    setEditingActor({
                                        ...editingActor,
                                        dob: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={editingActor.gender}
                                    onChange={(e) =>
                                        setEditingActor({ ...editingActor, gender: e.target.value })
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
                                value={editingActor.bio || ""}
                                onChange={(e) =>
                                    setEditingActor({
                                        ...editingActor,
                                        bio: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleUpdateActor}>
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default UpdateActorModal;
