import { BrowserRouter, Routes, Route } from 'react-router-dom'
import  Profile  from './pages/profile'
import Home from './pages/home'

import './App.css'

function App() {
  
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
