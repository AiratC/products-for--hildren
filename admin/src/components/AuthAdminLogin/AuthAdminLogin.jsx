import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AuthAdminLogin = ({ children }) => {
   const { admin } = useSelector(state => state.authAdmin);
   const location = useLocation()

   if (admin?.role_id === Number(import.meta.env.VITE_ROLE)) {
      if(location.pathname === '/') {
         return <Navigate to={`/dashboard`} replace/>
      }
   }


   return children
}

export default AuthAdminLogin
