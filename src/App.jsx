import './App.css'
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import { Route, Routes } from "react-router-dom";
import RecipeDetails from './components/Recipe'
import Signup from './components/Signup';
import Login from './components/Login';
import Favorites from './components/Favorites';

function App() {
  return (
      <nav>
        <div className="App">
          <Navbar/>
            <Routes>
              <Route excat path="/" element={<Homepage />}/>
              <Route path="/signup" element={<Signup/> }/>
              <Route path="/login" element={<Login/>} />
              <Route path="/favorites" element={<Favorites/>}/>
              <Route path="/recipe/:id" element={<RecipeDetails/>} />
            </Routes>
        </div>
      </nav>
  )
}

export default App
