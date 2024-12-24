import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>

    {/* Student Dashboard Route  */}
       <Route path="student" element={<Home />} />
     
      {/* Tutor Dashboard Route  */}
       <Route path="tutor" element={<Settings />} />
  
      {/* Admin Dashboard Route  */}
      <Route path="admin" element={<Settings />} />
  
      {/* Auth Routes  */}
    <Route element={<AuthLayout />}>
    
        <Route path="login" element={<Login />} />
    
        <Route path="register" element={<Register />} />
    
    </Route>
    
    {/* Dashboard Route  */}
    <Route path="dashboard" element={<Dashboard />}>
    
       {/* Student Dashboard Route  */}
       <Route path="student" element={<Home />} />
     
      {/* Tutor Dashboard Route  */}
       <Route path="tutor" element={<Settings />} />
  
      {/* Admin Dashboard Route  */}
      <Route path="admin" element={<Settings />} />
  
    </Route>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
