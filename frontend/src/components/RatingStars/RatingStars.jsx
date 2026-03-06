import React from 'react'
import styles from './RatingStars.module.css'
import { RiStarSFill } from 'react-icons/ri';

const RatingStars = ({ rating, size = 24 }) => {
   const fillPercentage = (rating / 5) * 100;

   // Вычисляем общую ширину 5 звезд, чтобы зафиксировать внутренний контейнер
   // Это гарантирует, что желтые звезды не будут сжиматься
   const totalWidth = size * 5; 

   return (
      <div className={styles.starWrapper} style={{ width: totalWidth, height: size }}>
         {/* Нижний слой: пустые звезды */}
         <div className={styles.starsEmpty}>
            {[...Array(5)].map((_, i) => (
               <RiStarSFill key={i} size={size} />
            ))}
         </div>

         {/* Верхний слой: "маска" (обрезает лишнее) */}
         <div
            className={styles.starsFilled}
            style={{ width: `${fillPercentage}%` }}
         >
            {/* Внутренний слой: ВСЕГДА полная ширина 5 звезд */}
            <div 
               className={styles.starsFilledInner} 
               style={{ width: totalWidth }}
            >
               {[...Array(5)].map((_, i) => (
                  <RiStarSFill key={i} size={size} />
               ))}
            </div>
         </div>
      </div>
   );
};

export default RatingStars
