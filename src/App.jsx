import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import AddKinkun from './pages/AddKinkun'
import ShowAllKinkun from './pages/ShowAllKinkun'
import EditKinkun from './pages/EditKinkun'
import Home from './pages/Home'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/AddKinkun" element={<AddKinkun/>}/>
          <Route path="/ShowAllKinkun" element={<ShowAllKinkun/>}/>
          <Route path="/EditKinkun/:id" element={<EditKinkun/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}
