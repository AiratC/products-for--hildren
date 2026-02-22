import React, { useCallback, useEffect, useState } from 'react'
import styles from './MobileMenu.module.css'
import closeMobileMenu from './../../assets/svg/closeMobileMenu.svg'
import userMobileLogo from './../../assets/svg/user-login.svg'
import userMobileMenu from './../../assets/svg/user-mobile-menu.svg'
import orderMobileLogo from './../../assets/svg/order-mobile-logo.svg'
import favoritesMobileLogo from './../../assets/svg/favorites-mobile-logo.svg'
import settingsMobileLogo from './../../assets/svg/settings-mobile-logo.svg'
import logoutMobileLogo from './../../assets/svg/logout-mobile-logo.svg'
import locationLogo from './../../assets/svg/location.svg'
import LoginForm from '../LoginForm/LoginForm'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../../redux/slices/authUserSlice'
import toast from 'react-hot-toast'
import Loader from '../Loader/Loader'
import { Link } from 'react-router-dom'
import { links } from '../../utils/arrayMenu'

const MobileMenu = ({ setIsMenuOpen, setIsCatalogOpen, isMenuOpen }) => {
   const [openLoginForm, setOpenLoginForm] = useState(false)
   const { user, loading } = useSelector((state) => state.authUser);
   const dispatch = useDispatch();

   // Блокировка скролла должна срабатывать только когда меню реально открыто
   useEffect(() => {
      if (isMenuOpen) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'auto';
      }


      return () => document.body.style.overflow = 'auto'
   }, [isMenuOpen])

   const handleLogout = useCallback(async () => {
      try {
         const result = await dispatch(userLogout()).unwrap();
         setIsMenuOpen();
         toast.success(result.message || 'Успешный выход!')
      } catch (error) {
         toast.error(error.message || 'Ошибка при выходе!')
      }
   }, [dispatch, setIsMenuOpen]);

   const handleClickMenuItem = () => {
      setIsMenuOpen()
   }

   return (
      <div className={`${styles.mobileMenuSide} ${isMenuOpen ? styles.active : ''}`}>
         {/* Затемнение  */}
         <div onClick={() => setIsMenuOpen(false)} className={styles.menuOverlay}></div>

         <div className={styles.menuContent}>
            <button onClick={() => setIsMenuOpen(false)} className={styles.closeMenu}>
               <img src={closeMobileMenu} alt="Закрыть" />
            </button>

            <div className={`${!user ? styles.marginTop : styles.marginTopUserHave} ${styles.userDataContainer}`}>
               {
                  !user ? (
                     <div>
                        {
                           !openLoginForm ? (
                              <div onClick={() => setOpenLoginForm(true)} className={styles.loginMobileUser}>
                                 <img src={userMobileLogo} alt="лого пользователя" />
                                 <span>Войти в личный кабинет</span>
                              </div>
                           ) : (
                              <LoginForm
                                 onClose={() => setIsMenuOpen(false)}
                              />
                           )
                        }
                     </div>

                  ) : (
                     <div className={styles.userMenu}>
                        <div className={styles.userData}>
                           <img src={userMobileMenu} alt="user" />
                           <div className={styles.userName}>{user?.name || 'Имя'}</div>
                           <div className={styles.userEmail}>{user?.email || 'email@gmail.com'}</div>
                           <div className={styles.menuData}>
                              <Link to={`/orders`} onClick={handleClickMenuItem}>
                                 <img src={orderMobileLogo} alt="Мои заказы лого" />
                                 <span>Мои заказы</span>
                              </Link>
                              <Link onClick={handleClickMenuItem} to={'/favorites'}>
                                 <img src={favoritesMobileLogo} alt="Мое избранное лого" />
                                 <span>Мое избранное</span>
                              </Link>
                              <Link to={`/settings`} onClick={handleClickMenuItem}>
                                 <img src={settingsMobileLogo} alt="Личные данные лого" />
                                 <span>Личные данные</span>
                              </Link>
                              {
                                 loading ? (
                                    <div className={`${styles.logoutMobileLoader}`}>
                                       <Loader />
                                    </div>
                                 ) : (
                                    <div onClick={handleLogout} className={styles.exitBtn}>
                                       <img src={logoutMobileLogo} alt="выйти" />
                                       <span>Выйти</span>
                                    </div>
                                 )
                              }
                           </div>
                        </div>
                     </div>
                  )
               }
            </div>

            {/* Ссылка на каталог внутри мобильного меню */}
            <div onClick={setIsCatalogOpen} className={styles.menuLink}>
               Каталог товаров
            </div>

            <ul className={`${styles.mobileLinks}`}>
               {
                  links.map((link) => (
                     <Link
                        key={link.id}
                        to={`${link.link}`}
                        style={{ color: 'black' }}
                        onClick={() => setIsMenuOpen(false)}
                     >
                        <li>
                           {link.name}
                        </li>
                     </Link>
                  ))
               }
            </ul>

            <div className={styles.citySelection}>
               <img src={locationLogo} alt="Локация" />
               <span>Город: <span className={styles.cityName}>Казань</span></span>
            </div>
         </div>
      </div>
   )
}

export default MobileMenu
