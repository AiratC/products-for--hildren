import React from 'react'
import searchSvg from './../../assets/svg/search.svg'
import styles from './Search.module.css';

const Search = () => {
   return (
      <form className={`${styles.formSearch}`}>
         <img className={`${styles.searchSvg}`} src={searchSvg} alt="searchSvg" />
         <input type="text" placeholder='Я хочу купить...'/>
         <button>Найти</button>
      </form>
   )
}

export default Search
