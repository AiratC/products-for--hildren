import React, { useEffect, useState } from 'react'
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

const MobileMenu = ({ setIsMenuOpen, setIsCatalogOpen, isMenuOpen }) => {
   const [openLoginForm, setOpenLoginForm] = useState(false)
   const user = false;

   // Блокировка скролла должна срабатывать только когда меню реально открыто
   useEffect(() => {
      if (isMenuOpen) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'auto';
      }


      return () => document.body.style.overflow = 'auto'
   }, [isMenuOpen])

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
                           <div className={styles.userName}>Анна</div>
                           <div className={styles.userEmail}>annaannnnanana@gmail.com</div>
                           <div className={styles.menuData}>
                              <div>
                                 <img src={orderMobileLogo} alt="Мои заказы лого" />
                                 <span>Мои заказы</span>
                              </div>
                              <div>
                                 <img src={favoritesMobileLogo} alt="Мое избранное лого" />
                                 <span>Мое избранное</span>
                              </div>
                              <div>
                                 <img src={settingsMobileLogo} alt="Личные данные лого" />
                                 <span>Личные данные</span>
                              </div>
                              <div>
                                 <img src={logoutMobileLogo} alt="Выйти лого" />
                                 <span>Выйти</span>
                              </div>
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
               <li>Акции</li>
               <li>О нас</li>
               <li>Блог</li>
               <li>Оптовым клиентам</li>
               <li>Возврат</li>
               <li>Оплата и доставка</li>
               <li>Контакты</li>
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
