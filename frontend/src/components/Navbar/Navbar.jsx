import React from 'react';
import styles from './Navbar.module.css';
import logo from './../../assets/svg/logo.svg'
import catalogBurgerMenu from './../../assets/svg/catalog-burger-menu.svg'
import userLoginSvg from './../../assets/svg/user-login.svg'
import cartLogoSvg from './../../assets/svg/cart.svg'
import locationLogo from './../../assets/svg/location.svg'
import Search from '../Search/Search';



const Navbar = () => {
   return (
      <>
         <nav style={{ borderBottom: '2px solid rgb(224 221 221)' }}>
            <div className={`container ${styles.mainNavContainer}`}>
               <div className={`${styles.logo}`}>
                  <img src={logo} alt="logo" />
               </div>
               <button className={`${styles.catalogBtn}`}>
                  Каталог товаров
                  <img src={catalogBurgerMenu} alt="catalog-burger-menu" />
               </button>
               <Search />
               <div className={`${styles.userLoginSvgContainer}`}>
                  <img src={userLoginSvg} alt="userLoginSvg" />
                  Войти в личный кабинет
               </div>
               <div className={`${styles.cartLogoSvgContainer}`}>
                  <img src={cartLogoSvg} alt="cart-logo" />
                  Корзина
               </div>
            </div>
         </nav>
         <nav>
            <div className={`container ${styles.secondaryNavContainer}`}>
               <span className={`${styles.textContentLeft}`}>
                  Онлайн гипермаркет товаров для детей
               </span>
               <ul className={`${styles.navigationMenuBottom}`}>
                  <li>Акции</li>
                  <li>О нас</li>
                  <li>Блог</li>
                  <li>Оптовым клиентам</li>
                  <li>Возврат</li>
                  <li>Оплата и доставка</li>
                  <li>Контакты</li>
               </ul>
               <div>
                  <img src={locationLogo} alt="location-logo" />
                  <span>Город: Казань</span>
               </div>
            </div>
         </nav>
      </>
   )
}

export default Navbar
