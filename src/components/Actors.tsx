import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "./ui/table";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import axios from "axios";
import AddActorModal from "./modals/AddActorModal";
import UpdateActorModal from "./modals/UpdateActorModal";

export interface Actor {
    _id?: string;
    name: string;
    dob: string;
    gender: string;
    bio: string;
}

const Actors = () => {
    const { toast } = useToast();
    const [actors, setActors] = useState<Actor[]>([]);
    const [openAddActor, setOpenAddActor] = useState(false);
    const [openUpdateActorDetail, setOpenUpdateActorDetail] = useState(false);
    const [selectedActorId, setSelectedActorId] = useState("");

    const fetchActors = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/actors");
            setActors(response.data);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    useEffect(() => {
        fetchActors();
    }, []);

    const handleEditActorDetail = (actorId: string) => {
        setSelectedActorId(actorId);
        setOpenUpdateActorDetail(true);
    };

    const handleDeleteActor = async (actorId: string) => {
        try {
            await axios.delete(`http://localhost:8000/api/actors/${actorId}`);
            toast({
                description: "Employee deleted successfully.. ✔️",
            });
            fetchActors();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Actors</h1>

                <Button onClick={() => setOpenAddActor(true)}>Add Actor</Button>
            </div>
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>S.No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead className="max-w-lg">Bio</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {actors.map((actor, index: number) => (
                            <TableRow key={actor._id}>
                                <TableCell>{index + 1}</TableCell>

                                <TableCell className="font-medium">{actor.name}</TableCell>
                                <TableCell>{actor.dob}</TableCell>
                                <TableCell>{actor.gender}</TableCell>
                                <TableCell className="max-w-lg">
                                    <p className="line-clamp-4">{actor.bio}</p>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() =>
                                                actor._id && handleEditActorDetail(actor._id)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => actor._id && handleDeleteActor(actor._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AddActorModal
                openAddActor={openAddActor}
                setOpenAddActor={setOpenAddActor}
                fetchActors={fetchActors}
            />
            <UpdateActorModal
                openUpdateActorDetail={openUpdateActorDetail}
                setOpenUpdateActorDetail={setOpenUpdateActorDetail}
                actorId={selectedActorId}
                fetchActors={fetchActors}
            />
        </div>
    );
};

export default Actors;
