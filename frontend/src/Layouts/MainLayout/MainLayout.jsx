import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './../../components/Navbar/Navbar'

const MainLayout = () => {
   return (
      <>
         <Navbar />
         <main>
            <Outlet />
         </main>
         {/* Footer */}
      </>
   )
}

export default MainLayout
