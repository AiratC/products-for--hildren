import React from 'react';
import styles from './Footer.module.css';
import logo from './../../assets/svg/logo.svg'
import vk from '../../assets/svg/vk.svg';


const Footer = () => {
   const currentYear = new Date().getFullYear();

   return (
      <footer className={styles.footer}>
         <div>
            <div className={styles.top}>
               {/* Лого и описание */}
               <div className={styles.info}>
                  <img src={logo} alt="Карапуз" className={styles.logo} />
                  <p className={styles.description}>
                     Онлайн гипермаркет <br /> товаров для детей
                  </p>
               </div>

               {/* Навигация */}
               <div className={styles.navGroup}>
                  <ul className={styles.list}>
                     <li><a href="/about">О нас</a></li>
                     <li><a href="/actions">Акции</a></li>
                     <li><a href="/blog">Блог</a></li>
                     <li><a href="/contacts">Контакты</a></li>
                  </ul>
                  <ul className={styles.list}>
                     <li><a href="/return">Возврат и гарантия</a></li>
                     <li><a href="/delivery">Оплата и доставка</a></li>
                  </ul>
                  <ul className={styles.list}>
                     <li><a href="/wholesale">Оптовым клиентам</a></li>
                  </ul>
               </div>

               {/* Соцсети */}
               <div className={styles.socials}>
                  <h4 className={styles.socialTitle}>Мы в социальных сетях</h4>
                  <div className={styles.icons}>
                     <a href="#"><img src={vk} alt="VK" /></a>
                     <a href="#"><img src={vk} alt="VK" /></a>
                     <a href="#"><img src={vk} alt="VK" /></a>
                     <a href="#"><img src={vk} alt="VK" /></a>
                  </div>
               </div>
            </div>

            <div className={styles.bottom}>
               <p>© {currentYear} karapuz.ru</p>
               <a href="/policy" className={styles.policy}>
                  Пользовательское соглашение / политика конфиденциальности
               </a>
            </div>
         </div>
      </footer>
   );
};

export default Footer;