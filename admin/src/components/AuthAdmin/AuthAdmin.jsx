import React from 'react'
import {  useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';


const AuthAdmin = ({ children }) => {
   const { admin } = useSelector(state => state.authAdmin);
   const location = useLocation()

   if(admin?.role_id === Number(import.meta.env.VITE_ROLE) && location.pathname === '/') {
      return <Navigate to={`/dashboard`}/>
   }

   if(admin?.role_id === Number(import.meta.env.VITE_ROLE)) {
      return children
   }

   return <Navigate to={`/`}/>


}

export default AuthAdmin
