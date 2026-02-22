import { Routes, Route } from 'react-router'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'

function App() {
  return (
    
    <Routes>
      <Route index element={<Login />}/>
      <Route path="register" element={<Register />}/>
      <Route path="home" element={<Home />}/>
    </Routes>
    
  )
}

export default App
