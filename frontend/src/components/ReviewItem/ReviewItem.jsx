import React from 'react'
import styles from './ReviewItem.module.css'
import { User } from 'lucide-react';
import { RiStarSFill } from 'react-icons/ri';

const ReviewItem = ({ review }) => {
   // Форматируем дату из TIMESTAMP WITH TIME ZONE
   const date = new Date(review.created_at).toLocaleDateString('ru-Ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   });

   return (
      <>
      <div className={styles.reviewItemContainer}>
         <div className={styles.avatar}>
               {
                  review.avatar ? (
                     <img className={styles.avatarImg} src={review.avatar} alt="" />
                  ) : (
                     <User size={24} color="#7bc9ef" />
                  )
               }
         </div>
         <div className={styles.reviewCard}>
         <div className={styles.header}>
            <div className={styles.rating}>
               {[...Array(5)].map((_, i) => (
                  <RiStarSFill
                     key={i}
                     size={18}
                     color={i < review.rating ? "#edf824" : "#e4e5e9"}
                  />
               ))}
            </div>
            <div className={styles.authorInfo}>
               <h4 className={styles.authorName}>{review.name || 'Анонимный пользователь'}</h4>
               <span className={styles.date}>{date}</span>
            </div>

         </div>

         <div className={styles.content}>
            {review.advantages && (
               <div className={styles.section}>
                  <h5 className={styles.sectionTitle}>Достоинства:</h5>
                  <p className={styles.text}>{review.advantages}</p>
               </div>
            )}

            {review.flaws && (
               <div className={styles.section}>
                  <h5 className={styles.sectionTitle}>Недостатки:</h5>
                  <p className={styles.text}>{review.flaws}</p>
               </div>
            )}

            {review.comment && (
               <div className={styles.section}>
                  <h5 className={styles.sectionTitle}>Комментарий:</h5>
                  <p className={styles.text}>{review.comment}</p>
               </div>
            )}
         </div>
      </div>
      </div>
      </>
      
   );
}

export default ReviewItem
