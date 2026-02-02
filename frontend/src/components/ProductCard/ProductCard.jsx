import React from 'react';
import { Button } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import styles from './ProductCard.module.css';

const ProductCard = ({ data }) => {
   const {
      title,
      price,
      old_price,
      product_images,
      is_new,
      characteristics
   } = data;

   // Берем первое изображение из массива JSONB или ставим заглушку
   const mainImage = product_images?.[0] || '/placeholder.png';
   const country = characteristics?.country || 'Польша'; // Пример из макета

   return (
      <div className={styles.card}>
         <div className={styles.imageWrapper}>
            {is_new && <span className={styles.badgeNew}>NEW</span>}
            <HeartOutlined className={styles.favoriteIcon} />
            <img src={mainImage} alt={title} className={styles.productImg} />
         </div>

         <div className={styles.info}>
            <h3 className={styles.title}>{title.slice(0, 20)}..., {country}</h3>

            <div className={styles.priceSection}>
               <span className={styles.currentPrice}>
                  {Number(price).toLocaleString()} ₽
               </span>
               {old_price && (
                  <span className={styles.oldPrice}>
                     {Number(old_price).toLocaleString()} ₽
                  </span>
               )}
            </div>

            <Button type="primary" className={styles.buyBtn}>
               В корзину
            </Button>

            <button className={styles.oneClickBtn}>
               Купить в один клик
            </button>
         </div>
      </div>
   );
};

export default ProductCard;