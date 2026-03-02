import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Heart } from 'lucide-react';
import fetchAxios from '../../utils/fetchAxios';
import styles from './ProductPage.module.css';
import Loader from '../../components/Loader/Loader';
import { RiStarSFill } from "react-icons/ri";

const ProductPage = () => {
   const { id } = useParams(); // Предположим, роут /product/:id
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
   const [activeImage, setActiveImage] = useState(0);
   const [openSection, setOpenSection] = useState('description');

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            setLoading(true);
            const { data } = await fetchAxios.get(`/api/products/get-product?productId=${id}`);
            setProduct(data.product);
         } catch (error) {
            console.error("Ошибка загрузки товара:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchProduct();
   }, [id]);

   if (loading) return <div className="preloader"><Loader /></div>;
   if (!product) return <div>Товар не найден</div>;

   const toggleSection = (section) => {
      setOpenSection(openSection === section ? null : section);
   };

   return (
      <div className={styles.containerProductPage}>
         <div className={styles.productMain}>
            {/* Левая часть: Галерея */}
            <div className={styles.gallery}>
               <div className={styles.mainImageWrapper}>
                  <img
                     src={product.product_images?.[activeImage]}
                     alt={product.title}
                     className={styles.mainImage}
                  />
               </div>
            </div>

            {/* Правая часть: Инфо */}
            <div className={styles.info}>
               <div className={styles.header}>
                  <span className={styles.article}>Артикул {product.article}</span>
                  <h1 className={styles.title}>{product.title}</h1>
                  <div className={styles.ratingRow}>
                     <div className={styles.starsContainer}>
                        <span className={styles.stars}>
                           <RiStarSFill className={styles.star} size={24} />
                           <RiStarSFill className={styles.star} size={24} />
                           <RiStarSFill className={styles.star} size={24} />
                           <RiStarSFill className={styles.star} size={24} />
                           <RiStarSFill className={styles.star} size={24} />
                        </span>
                        <span className={styles.noReviews}>Нет отзывов</span>
                     </div>
                     <button className={styles.favoriteBtn}>
                        <Heart size={24} /> <span>В избранное</span>
                     </button>
                  </div>
               </div>

               <p className={styles.colorLabel}>Цвет товара: <b>Белый</b></p>

               <div className={styles.thumbnails}>
                  {product.product_images?.map((img, idx) => (
                     <div
                        key={idx}
                        className={`${styles.thumb} ${activeImage === idx ? styles.activeThumb : ''}`}
                        onClick={() => setActiveImage(idx)}
                     >
                        <img src={img} alt={`${product.title} ${idx}`} />
                     </div>
                  ))}
               </div>

               <div className={styles.priceSection}>
                  <span className={styles.price}>{Number(product.price).toLocaleString()} <span>₽</span></span>
               </div>

               <div className={styles.actions}>
                  <button className={styles.fastOrderBtn}>Быстрый заказ</button>
                  <button className={styles.addToCartBtn}>В корзину</button>
               </div>

               <div className={styles.deliveryInfo}>
                  <span>Ваш город: <b>Москва</b></span>
                  <a href="#delivery">Подробнее о доставке</a>
               </div>

               <div className={styles.foundCheaper}>
                  <span>Нашли дешевле?</span>
               </div>
            </div>
         </div>

         {/* Аккордеоны (Описание, Характеристики) */}
         <div className={styles.accordionContainer}>
            <div className={styles.accordionItem}>
               <button
               className={`${openSection === 'description' && styles.buttonActive}`} 
               onClick={() => toggleSection('description')}>
                  Описание
               </button>
            </div>
            <div className={styles.accordionItem}>
               <button
               className={`${openSection === 'specs' && styles.buttonActive}`} 
               onClick={() => toggleSection('specs')}>
                  Характеристики
               </button>
            </div>
            <div className={styles.accordionItem}>
               <button
               className={`${openSection === 'reviews' && styles.buttonActive}`} 
               onClick={() => toggleSection('reviews')}>
                  Отзывы
               </button>
            </div>
         </div>

         {/* Отображение контента описание, характеристик, отзывов */}
         {openSection === 'description' && (
            <div className={styles.accordionContent}>
               Описание контент
            </div>
         )}

         {openSection === 'specs' && (
            <div className={styles.accordionContent}>
               Характеристики контент
            </div>
         )}

         {openSection === 'reviews' && (
            <div className={styles.accordionContent}>Отзывы контент</div>
         )}
      </div>
   );
};

export default ProductPage;