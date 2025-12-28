import React from 'react'
import { useParams } from 'react-router-dom'

const CategoryProductsView = () => {
   const params = useParams();
   console.log(params)
   return (
      <div>
         CategoryProductsView
      </div>
   )
}

export default CategoryProductsView
