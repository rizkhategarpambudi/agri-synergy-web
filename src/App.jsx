// import { useState } from 'react'
import Login from './pages/LoginPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import Header from './components/Header'
import Forgot from './pages/ForgotPage'
import MainDropship from './pages/MainDropship'
import SidebarProfile from './components/SidebarProfile'

import Kategori from './pages/admin/Kategori'
import Produk from './pages/admin/Produk'
import DetailSaldo from './pages/admin/Detailsaldo'

function App() {
  return (
   <Router>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/forgot' element={<Forgot/>}/>
      <Route path='/header' element={<Header/>}/>
      <Route path='/dropshipper' element={<MainDropship/>}/>
      <Route path='/sidebar' element={<SidebarProfile/>}/>

      <Route path='/kategori' element={<Kategori/>}/>
      <Route path='/produk' element={<Produk/>}/>
      <Route path='/detail-saldo' element={<DetailSaldo/>}/>
    </Routes>
   </Router>
  )
}

export default App
