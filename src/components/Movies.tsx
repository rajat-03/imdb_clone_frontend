// import React, { useEffect, useState } from "react";
// import Fab from "@mui/material/Fab";
// import AddIcon from "@mui/icons-material/Add";
// import LoadingScreen from "../components/LoadingScreen";
// import MovieCard from "./MovieCard";
// import CreateMovieModal from "./modals/CreateMovieModal";

// function Movies() {
//   const [movies, setMovies] = useState([]);
//   const [actors, setActors] = useState([]);
//   const [producers, setProducers] = useState([]);
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showCreateMovieModal, setShowCreateMovieModal] = useState(false);
//   const handleCreateMovieModalShow = () => setShowCreateMovieModal(true);
//   const handleCreateMovieModalClose = () => setShowCreateMovieModal(false);

//   const getMovies = async () => {
//     const res = await fetch('https://imdbclone-backend.onrender.com/movie/all', {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await res.json();
//     setLoading(false);
//     if (data.data) {
//       setMovies(data.data);
//     } else {
//       setErr(data.error);
//     }
//   };

//   const getActors = async () => {
//     const res = await fetch('https://imdbclone-backend.onrender.com/cast/actors', {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await res.json();
//     if (data.data) {
//       setActors(data.data);
//     } else {
//       setErr(data.err);
//     }
//   };

//   const getProducers = async () => {
//     const res = await fetch(
//       'https://imdbclone-backend.onrender.com/cast/producers',
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const data = await res.json();
//     if (data.data) {
//       setProducers(data.data);
//     } else {
//       setErr(data.error);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     getMovies();
//     getProducers();
//     getActors();
//   }, []);
//   return (
//     <div className="mt-5 d-flex flex-column align-items-center container">
//       <div className="mb-5 text-uppercase d-flex justify-content-between align-items-center w-100">
//         <h2>Movies List</h2>
//         <Fab
//           color="primary"
//           aria-label="add"
//           onClick={handleCreateMovieModalShow}
//         >
//           <AddIcon />
//         </Fab>
//       </div>
//       <div className="w-100">
//         {loading ? (
//           <div className="d-flex justify-content-center align-items-center">
//             <LoadingScreen h={"15%"} w={"3.5%"} c={"#e4d00a"} />
//           </div>
//         ) : (
//           <div className="w-100">
//             {err === "" ? (
//               <div className="w-100 mb-5">
//                 {movies.length === 0 ? (
//                   <p className="w-100 text-danger text-center fs-3">
//                     There is no Movies to display
//                   </p>
//                 ) : (
//                   <section>
//                     <div className="container px-3 px-lg-3 mt-0">
//                       <div className="row gx-4 gx-lg-4 row-cols-1 row-cols-md-2 row-cols-xl-4 justify-content-start">
//                         {movies.map((movie, index) => (
//                           <MovieCard
//                             movie={movie}
//                             getMovies={getMovies}
//                             getActors={getActors}
//                             getProducers={getProducers}
//                             actors={actors}
//                             producers={producers}
//                             key={index}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </section>
//                 )}
//               </div>
//             ) : (
//               <p className="text-danger text-center">{err}</p>
//             )}
//           </div>
//         )}
//       </div>
//       <CreateMovieModal
//         showCreateMovieModal={showCreateMovieModal}
//         handleCreateMovieModalClose={handleCreateMovieModalClose}
//         getMovies={getMovies}
//         getActors={getActors}
//         getProducers={getProducers}
//         actors={actors}
//         producers={producers}
//       />
//     </div>
//   );
// }

// export default Movies;

import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const Movies = () => {
  const navigate = useNavigate()
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Actors</h1>

                <Button onClick={() => navigate("/movies/add")}>Add Movie</Button>
            </div>
            </div>

  )
}

export default Movies