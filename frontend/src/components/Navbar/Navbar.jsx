import React, { useState } from 'react';
import styles from './Navbar.module.css';
import logo from './../../assets/svg/logo.svg'
import catalogBurgerMenu from './../../assets/svg/catalog-burger-menu.svg'
import closeCatalogIcon from './../../assets/svg/closeCatalogIcon.svg'
import userLoginSvg from './../../assets/svg/user-login.svg'
import cartLogoSvg from './../../assets/svg/cart.svg'
import locationLogo from './../../assets/svg/location.svg'
import Search from '../Search/Search';
import { Link } from 'react-router-dom'
import Catalog from '../Catalog/Catalog';
import mobileBurgerMenuIcon from './../../assets/svg/mobile-burger-menu.svg'
import MobileMenu from '../MobileMenu/MobileMenu';
import AuthPopup from '../AuthPopup/AuthPopup';
import { useSelector } from 'react-redux';
import { links } from '../../utils/arrayMenu';

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false); // Для мобильного меню
   const [isCatalogOpen, setIsCatalogOpen] = useState(false); // Для десктопного и моб. каталога
   const [openAuthPopup, setIsOpenAuthPopup] = useState(false);
   const { user } = useSelector((state) => state.authUser);
   const { cartItems } = useSelector(state => state.cart);

   return (
      <header className={styles.headerWrapper}>
         <nav style={{ borderBottom: '2px solid rgb(224 221 221)' }}>
            <div className={`${styles.mainNavContainer}`}>
               {/* Клик по бургеру открывает общее мобильное меню */}
               <div className={styles.mobileBurgerMenuContainer}>
                  <button onClick={() => setIsMenuOpen(true)}>
                     <img src={mobileBurgerMenuIcon} alt="Мобильное бурген меню" />
                  </button>
               </div>
               <Link to={`/`} className={`${styles.logo}`}>
                  <img src={logo} alt="logo" />
               </Link>
               <button
                  className={`${styles.catalogBtn}`}
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
               >
                  Каталог товаров
                  <img src={isCatalogOpen ? closeCatalogIcon : catalogBurgerMenu} alt="catalog-burger-menu" />
               </button>
               <div className={styles.searchContainer}>
                  <Search />
               </div>
               <div className={styles.containerLogin}>
                  <div
                     className={styles.userLoginSvgContainer}
                     onClick={(e) => {
                        e.stopPropagation(); // ВАЖНО: Клик не пойдет дальше к document
                        setIsOpenAuthPopup(true);
                     }}
                  >
                     <img src={userLoginSvg} alt="userLoginSvg" />
                     <span>{!user ? 'Войти в личный кабинет' : 'Личный кабинет'}</span>
                  </div>
                  {/* Попап */}
                  <AuthPopup
                     isOpen={openAuthPopup}
                     onClose={() => setIsOpenAuthPopup(false)}
                     isAuth={!user ? false : true}
                     user={user}
                  />
               </div>
               <Link to={`/cart`}>
                  <div className={`${styles.cartLogoSvgContainer}`}>
                     <div className={styles.cartContainer}>
                        <img src={cartLogoSvg} alt="cart-logo" />
                        {
                           cartItems.length > 0 && (
                              <div className={styles.countCartContainer}>
                                 {cartItems.length}
                              </div>
                           )
                        }
                     </div>
                     <span>Корзина</span>
                  </div>
               </Link>
            </div>
         </nav>

         <nav className={styles.secondaryNavContainerWrapper}>
            <div className={`${styles.secondaryNavContainer}`}>
               <span className={`${styles.textContentLeft}`}>
                  Онлайн гипермаркет товаров для детей
               </span>
               <div className={styles.navigationMenuBottomContainer}>
                  <ul className={`${styles.navigationMenuBottom}`}>
                     {
                        links.map((link) => (
                           <Link
                              key={link.id}
                              to={`${link.link}`}
                              className={styles.colorItem}
                           >
                              <li>
                                 {link.name}
                              </li>
                           </Link>
                        ))
                     }
                  </ul>
               </div>
               <div className={styles.cityContainer}>
                  <img src={locationLogo} alt="location-logo" />
                  <span>Город: Казань</span>
               </div>
            </div>
         </nav>

         {/* Мобильное меню (Выезжает сбоку) */}
         <MobileMenu
            setIsMenuOpen={() => setIsMenuOpen(false)}
            setIsCatalogOpen={() => setIsCatalogOpen(true)}
            isMenuOpen={isMenuOpen}
         />



         {/* Поисковик виден только на мобильных устройствах */}
         <div className={styles.mobileSearchContainer}>
            <div className="container">
               <Search />
            </div>
         </div>

         {/* Рендер компонента каталог */}
         {isCatalogOpen && (
            <Catalog
               onClose={() => setIsCatalogOpen(false)}
               onCloseMobileMenu={() => setIsMenuOpen(false)}
               isMobile={true}
            />
         )}

      </header>
   )
}

export default Navbar
