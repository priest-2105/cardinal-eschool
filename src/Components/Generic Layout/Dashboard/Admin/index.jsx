import React from 'react'
import Navbar from './Navbar/Index'
import Footer from './Footer/Index'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './Sidebar/Index'

function DashboardAdminRootLayout() {
  return (
    <>
        <AdminSidebar/>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default DashboardAdminRootLayout;