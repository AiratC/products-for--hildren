import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';
import fetchAxios from '../../utils/fetchAxios';
import styles from './ProductPage.module.css';
import Loader from '../../components/Loader/Loader';

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
                     <span className={styles.stars}>☆☆☆☆☆</span>
                     <span className={styles.noReviews}>Нет отзывов</span>
                  </div>
                  <button className={styles.favoriteBtn}>
                     <Heart size={20} /> <span>В избранное</span>
                  </button>
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
                  <span className={styles.price}>{Number(product.price).toLocaleString()} ₽</span>
               </div>

               <div className={styles.actions}>
                  <button className={styles.fastOrderBtn}>Быстрый заказ</button>
                  <button className={styles.addToCartBtn}>В корзину</button>
               </div>

               <div className={styles.deliveryInfo}>
                  <span>Ваш город: <b>Москва</b></span>
                  <a href="#delivery">Подробнее о доставке</a>
               </div>

               <div>
                  <span>Нашли дешевле?</span>
               </div>
            </div>
         </div>
         {/* Аккордеоны (Описание, Характеристики) */}
         <div className={styles.accordionContainer}>
            <div className={styles.accordionItem}>
               <button onClick={() => toggleSection('description')}>
                  Описание {openSection === 'description' ? <ChevronUp /> : <ChevronDown />}
               </button>
               {openSection === 'description' && (
                  <div className={styles.accordionContent}>
                     <p>{product.description}</p>
                  </div>
               )}
            </div>
            <div className={styles.accordionItem}>
               <button onClick={() => toggleSection('specs')}>
                  Характеристики {openSection === 'specs' ? <ChevronUp /> : <ChevronDown />}
               </button>
               {openSection === 'specs' && (
                  <div className={styles.accordionContent}>
                     {/* Здесь можно вывести таблицу характеристик */}
                     <p>Материал: Береза, МДФ</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default ProductPage;