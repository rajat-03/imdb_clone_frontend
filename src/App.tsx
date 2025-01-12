import './App.css'
import AddMovieForm from './add-movie.form'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Actors from "./components/Actors"
import Producers from "./components/Producers"
import { Toaster } from './components/ui/toaster'

function App() {

  return (
    <div>
    {/* <AddMovieForm /> */}
    <Toaster />
    <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="/movie" element={<AddMovieForm />}></Route>

          {/* <Route path="/" element={<Movies />}></Route> */}
          <Route path="/actors" element={<Actors />}></Route>
          <Route path="/producers" element={<Producers />}></Route>
        </Route>
        {/* <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route> */}
      </Routes>
    </div>
  )
}

export default App
