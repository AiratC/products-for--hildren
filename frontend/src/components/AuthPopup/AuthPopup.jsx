import React, { useCallback } from 'react'
import styles from './AuthPopup.module.css';

import myOrdersLogo from './../../assets/svg/order-mobile-logo.svg'
import myFavoritesLogo from './../../assets/svg/favorites-mobile-logo.svg'
import settingsLogo from './../../assets/svg/settings-mobile-logo.svg'
import logoutLogo from './../../assets/svg/logout-mobile-logo.svg'
import { Link, useNavigate } from 'react-router';
import LoginForm from '../LoginForm/LoginForm';
import useCloseModal from '../../hooks/useCloseModal';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../redux/slices/authUserSlice';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';


const AuthPopup = ({ isOpen, isAuth, user, onClose }) => {
   const containerRef = useCloseModal(onClose);
   const dispatch = useDispatch()
   const { loading } = useSelector((state) => state.authUser);
   const navigate = useNavigate();

   const handleLogout = useCallback(async () => {
      try {
         const result = await dispatch(userLogout()).unwrap();
         onClose();
         toast.success(result.message || 'Успешный выход!');
         navigate('/')
      } catch (error) {
         toast.error(error.message || 'Ошибка при выходе!')
      }
   }, [dispatch, onClose, navigate]);

   const handleClickMenuItem = () => {
      onClose()
   }

   if (!isOpen) return null;

   return (
      <div ref={containerRef} className={styles.wrapper}>
         {/* Треугольник - стрелочка сверху */}
         <div className={styles.arrow}></div>

         <div className={styles.container}>
            <button onClick={onClose} className={styles.close}>&times;</button>

            {
               isAuth ? (
                  // Меню авторизованного пользователя
                  <div className={styles.profile}>
                     <div className={styles.userHeader}>
                        <div className={styles.userDataContainer}>
                           <div className={styles.avatar}>
                              <span>{user?.name?.[0] || 'Avatar'}</span>
                           </div>
                           <div className={styles.userText}>
                              <p className={styles.name}>{user?.name || 'Имя'}</p>
                              <p className={styles.email}>{user?.email || 'email@gmail.com'}</p>
                           </div>
                        </div>

                        <nav className={styles.nav}>
                           <Link onClick={handleClickMenuItem} to="/orders" className={styles.link}>
                              <img src={myOrdersLogo} alt="Мои заказы" />
                              <span>Мои заказы</span>
                           </Link>
                           <Link onClick={handleClickMenuItem} to="/favorites" className={styles.link}>
                              <img src={myFavoritesLogo} alt="Мое избранное" />
                              <span>Мое избранное</span>
                           </Link>
                           <Link onClick={handleClickMenuItem} to="/settings" className={styles.link}>
                              <img src={settingsLogo} alt="Настройки личных данных" />
                              <span>Настройки личных данных</span>
                           </Link>
                           {
                              loading ? (
                                 <div className={`${styles.logoutLoader}`}>
                                    <Loader />
                                 </div>
                              ) : (
                                 <button onClick={handleLogout} className={styles.exitBtn}>
                                    <img src={logoutLogo} alt="выйти" />
                                    <span>Выйти</span>
                                 </button>
                              )
                           }
                        </nav>
                     </div>
                  </div>
               ) : (
                  /* Форма входа */
                  <LoginForm
                     onClose={onClose}
                  />
               )
            }
         </div>

      </div>
   )
}

export default AuthPopup
