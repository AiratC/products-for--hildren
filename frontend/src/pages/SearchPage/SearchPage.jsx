import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SearchPage = () => {
   const [searchParams] = useSearchParams();
   const searchTerm = searchParams.get('query');

   return (
      <div>
         Search Page: text {searchTerm}
      </div>
   )
}

export default SearchPage
