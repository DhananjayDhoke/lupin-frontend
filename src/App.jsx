import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './components/login/login'
import DashboardPage from './components/Pages/DashboardPage'
import ReportPage from './components/Pages/ReportPage'
import RequestPage from './components/Pages/RequestPage'
import AdminProtectedRoute from './components/protectedroutes/protect'
import { Toaster } from 'react-hot-toast'
//import { ToastContainer} from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

function App() {
  

  return (
    <div>
       <Routes>
          <Route path='/' element = {<Login/>}/> 
          <Route path='/dashboard' element={<AdminProtectedRoute><DashboardPage/></AdminProtectedRoute>}/>
          <Route path='/campReport' element ={<AdminProtectedRoute><ReportPage/></AdminProtectedRoute>}/>
          <Route path='/campRequest' element ={<AdminProtectedRoute><RequestPage/></AdminProtectedRoute>}/>
       </Routes>
       <Toaster position="top-center" reverseOrder={false}
       
       />
    </div>
  )
}

export default App
