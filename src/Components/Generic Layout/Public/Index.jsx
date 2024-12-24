import React from 'react'
import Navbar from './Navbar/Index'
import Footer from './Footer/Index'
import { Outlet } from 'react-router-dom'

function PublicRootLayout() {
  return (
    <>
        <Navbar/>
        <main className="min-h-[60vh]">
            <Outlet/>
        </main>
        <Footer/>
    </>
  )
}

export default PublicRootLayout;