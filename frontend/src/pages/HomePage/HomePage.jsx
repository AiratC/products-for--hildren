import React from 'react'
import Hero from '../../components/Hero/Hero'
import RandomProductSection from '../../components/RandomProductSection/RandomProductSection'
import PopularCategories from '../../components/PopularCategories/PopularCategories'

const HomePage = () => {
   return (
      <>
         <Hero/>
         <RandomProductSection />
         <PopularCategories/>
      </>
   )
}

export default HomePage
