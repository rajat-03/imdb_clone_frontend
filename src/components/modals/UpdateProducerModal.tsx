import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Producer } from '../Producers';
import axios from 'axios';
import { Textarea } from '../ui/textarea';

interface UpdateProducerModalProps {
    openUpdateProducerDetail: boolean;
    setOpenUpdateProducerDetail: (open: boolean) => void;
    producerId: string;
    fetchProducers: () => void;
}

const UpdateProducerModal: React.FC<UpdateProducerModalProps> = ({ openUpdateProducerDetail, setOpenUpdateProducerDetail, producerId, fetchProducers }) => {

    const [editingProducer, setEditingProducer] = useState<Producer>({
        name: "",
        dob: "",
        gender: "",
        bio: "",
    });

    const fetchProducerDetails = async (producerId: string) => {
        try {
            const response = await axios.get(`https://imdb-clone-backend-971u.onrender.com/api/producers/${producerId}`);
            setEditingProducer(response.data);
        } catch (error: any) {
            console.error("Error fetching producer details:", error);
        }
    }

    useEffect(() => {
        if (producerId) { // Ensure producerId is valid
            fetchProducerDetails(producerId);
        }
    }, [producerId]); // Include producerId in the dependency array

    const handleUpdateProducer = async () => {
        if (!editingProducer.name || !editingProducer.dob || !editingProducer.gender || !editingProducer.bio) {
            toast({
                variant: "dark",
                description: "All fields are required.",
            });
            return;
        }

        try {
            await axios.put(`https://imdb-clone-backend-971u.onrender.com/api/producers/${producerId}`, editingProducer);
            toast({
                variant: "dark",
                description: "Producer updated successfully.. ✔️",
            });
            fetchProducers();
            setOpenUpdateProducerDetail(false);
        } catch (error) {
            toast({
                variant: "dark",
                description: "Error updating producer.. ❌",
            });
            console.error("Error updating producer:", error);
        }
    };

    const handleCancelClick = () => {
        setEditingProducer({
            name: "",
            dob: "",
            gender: "",
            bio: "",
        });
        setOpenUpdateProducerDetail(false);
    }

    const { toast } = useToast();

    return (
        <>{openUpdateProducerDetail &&
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Edit Producer</h2>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={editingProducer.name || ""}
                                onChange={(e) =>
                                    setEditingProducer({
                                        ...editingProducer,
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
                                value={editingProducer.dob || ""}
                                onChange={(e) =>
                                    setEditingProducer({
                                        ...editingProducer,
                                        dob: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <select
                                id="gender"
                                value={editingProducer.gender}
                                onChange={(e) =>
                                    setEditingProducer({ ...editingProducer, gender: e.target.value })
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
                                value={editingProducer.bio || ""}
                                onChange={(e) =>
                                    setEditingProducer({
                                        ...editingProducer,
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
                            <Button size="sm" onClick={handleUpdateProducer}>
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

export default UpdateProducerModal;
