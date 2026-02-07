import React from 'react'
import Hero from '../../components/Hero/Hero'
import RandomProductSection from '../../components/RandomProductSection/RandomProductSection'
import PopularCategories from '../../components/PopularCategories/PopularCategories'
import NewProducts from '../../components/NewProducts/NewProducts'

const HomePage = () => {
   return (
      <>
         <Hero/>
         <RandomProductSection />
         <PopularCategories/>
         <NewProducts/>
      </>
   )
}

export default HomePage
