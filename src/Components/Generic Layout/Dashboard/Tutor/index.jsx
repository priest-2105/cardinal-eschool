import React from 'react'
import Navbar from './Navbar/Index'
import Footer from './Footer/Index'
import { Outlet } from 'react-router-dom'
import TutorSidebar from './Sidebar/Index'

function DashboardTutorRootLayout() {
  return (
    <>
        <TutorSidebar/>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default DashboardTutorRootLayout;