import './App.css'
import AddMovieForm from './components/add-movie.form'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Actors from "./components/Actors"
import Producers from "./components/Producers"
import { Toaster } from './components/ui/toaster'
import Movies from './components/Movies'

function App() {

  return (
    <div>
      {/* <AddMovieForm /> */}
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="/" element={<Movies />}></Route>
          <Route path="/movies/add" element={<AddMovieForm />}></Route>
          <Route path="/actors" element={<Actors />}></Route>
          <Route path="/producers" element={<Producers />}></Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
