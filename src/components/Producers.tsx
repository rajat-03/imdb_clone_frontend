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
import AddProducerModal from "./modals/AddProducerModal";
import UpdateProducerModal from "./modals/UpdateProducerModal";

export interface Producer {
  _id?: string;
  name: string;
  dob: string;
  gender: string;
  bio: string;
}

const Producers = () => {
  const { toast } = useToast();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [openAddProducer, setOpenAddProducer] = useState(false);
  const [openUpdateProducerDetail, setOpenUpdateProducerDetail] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducers = async () => {
    try {
      const response = await axios.get("https://imdb-clone-backend-971u.onrender.com/api/producers");
      setProducers(response.data);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  const handleEditProducerDetail = (producerId: string) => {
    setSelectedProducerId(producerId);
    setOpenUpdateProducerDetail(true);
  };

  const handleDeleteProducer = async (producerId: string) => {
    try {
      await axios.delete(`https://imdb-clone-backend-971u.onrender.com/api/producers/${producerId}`);
      toast({
        description: "Producer deleted successfully.. ✔️",
      });
      fetchProducers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Producers</h1>

        <Button onClick={() => setOpenAddProducer(true)}>Add Producer</Button>
      </div>
      <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : producers.length === 0 ? (
          <div className="p-4 text-center">No data available</div>
        ) : (
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
              {producers.map((producer, index: number) => (
                <TableRow key={producer._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="font-medium">{producer.name}</TableCell>
                  <TableCell>{producer.dob}</TableCell>
                  <TableCell>{producer.gender}</TableCell>
                  <TableCell className="max-w-lg">
                    <p className="line-clamp-4">{producer.bio}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() =>
                          producer._id && handleEditProducerDetail(producer._id)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => producer._id && handleDeleteProducer(producer._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AddProducerModal
        openAddProducer={openAddProducer}
        setOpenAddProducer={setOpenAddProducer}
        fetchProducers={fetchProducers}
      />
      <UpdateProducerModal
        openUpdateProducerDetail={openUpdateProducerDetail}
        setOpenUpdateProducerDetail={setOpenUpdateProducerDetail}
        producerId={selectedProducerId}
        fetchProducers={fetchProducers}
      />
    </div>
  );
};

export default Producers;
