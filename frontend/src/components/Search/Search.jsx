import React, { useState } from 'react'
import searchSvg from './../../assets/svg/search.svg'
import styles from './Search.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

const Search = () => {
   const location = useLocation();
   const [searchQuery, setSearchQuery] = useState('');
   const navigate = useNavigate();

   const handleFormSubmit = (event) => {
      event.preventDefault();
      if (searchQuery.trim()) {
         // Переходим на страницу поиска с параметром в URL
         navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      }
   }

   const handleArrowLeft = (e) => {
      e.stopPropagation(); // Останавливает передачу клика родителю
      e.preventDefault();

      if (window.history.length > 1) {
         navigate(-1);
         setSearchQuery('');
      } else {
         navigate('/');
         setSearchQuery('');
      };
      setSearchQuery('');
   }

   return (
      <form onSubmit={handleFormSubmit} className={`${styles.formSearch}`}>
         {
            location.pathname === '/search' ? (
               <div
                  onClick={(e) => handleArrowLeft(e)}
                  className={styles.arrowWrapperSvg}
               >
                  <FaArrowLeft />
               </div>
            ) : (
               <img className={`${styles.searchSvg}`} src={searchSvg} alt="searchSvg" />
            )
         }
         <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} type="text" placeholder='Я хочу купить...' />
         <button type='submit'>Найти</button>
      </form>
   )
}

export default Search
