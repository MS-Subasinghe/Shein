import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import Shop from './pages/Shop'
import ClothesDisplay from './components/ClothesDisplay'
import CartPage from './components/CartPage'

function App() {
  return (

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path='/shop' element={<Shop/>}/>
      <Route path='/admin' element={<AdminPanel/>}/>
      <Route path="/" element={<ClothesDisplay />} />
      <Route path='/cart' element={<CartPage/>} />
      {/* more routes can go here */}
    </Routes>

  )
}

export default App
