import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Blogs from './components/Blogs';
import Createblog from './components/Createblog';
import { ToastContainer, toast } from 'react-toastify';
import Blogdetails from './components/Blogdetails';
import Editblog from './components/Editblog';

function App() {

  return (
    <>
      <div className='bg-dark text-center py-2 shadow-lg'>
        <h1 className='text-white'>React & Laravel Blog App</h1>
      </div>
      <Routes>
        <Route path='/' element={<Blogs />} />
        <Route path='/create' element={<Createblog />} />
        <Route path='/blog/:id' element={<Blogdetails />} />
        <Route path='/blog/edit/:id' element={<Editblog />} />

      </Routes>
      <ToastContainer />

    </>
  )
}

export default App
