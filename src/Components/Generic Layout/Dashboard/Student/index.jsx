import React from 'react'
import Navbar from './Navbar/Index'
import Footer from './Footer/Index'
import { Outlet } from 'react-router-dom'
import StudentSidebar from './Sidebar/Index'

function DashboardStudentRootLayout() {
  return (
    <>
        <StudentSidebar/>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default DashboardStudentRootLayout;