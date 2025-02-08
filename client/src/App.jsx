import './App.css'
import Navbar from './component/Navbar'
import Home from './component/Home'
import Signup from "./Auth/Signup";
import Login from './Auth/Login';
import FoundForm from './component/Found/FoundForm';
import LostForm from './component/LostForm';
import Allfounds from './component/Found/Allfounds';
import { Route,Routes } from 'react-router-dom';
function App() {
  return (
       <div className=" bg-black h-screen text-white">
            <Navbar></Navbar>
            <Routes>
   <Route path="/signup" element={<Signup />} />
   <Route path="/login" element={<Login />} />
   <Route path="/found" element={<FoundForm />} />
   <Route path="/lost" element={<LostForm />} />
   <Route path="/get/found" element={<Allfounds />} />


</Routes>

       </div>
  )
}
export default App
