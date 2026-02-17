import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PageNotFound.module.css'

const PageNotFound = () => {
   const navigate = useNavigate();

   return (
      <div className={styles.pageWrapper}>

         {/* Основной контент 404 */}
         <main className={styles.mainContent}>
            <h1 className={styles.errorCode} >404</h1>

            <h2 className={styles.title}>Страница не найдена</h2>

            <p className={styles.description}>
               Мы не можем найти страницу, которую вы ищете.<br />
               Она может быть еще не зарегистрирована или<br />
               её не существует
            </p>

            <button className={styles.button}
               onClick={() => navigate('/')}
            >
               На главную
            </button>
         </main>
      </div>
   );
};


export default PageNotFound;