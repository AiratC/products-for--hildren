import React from 'react'
import { useSelector } from 'react-redux'

const ProfilePage = () => {
   const { admin } = useSelector(state => state.authAdmin);

   console.log(`admin: `, admin)
   return (
      <div>
         Admin
      </div>
   )
}

export default ProfilePage
