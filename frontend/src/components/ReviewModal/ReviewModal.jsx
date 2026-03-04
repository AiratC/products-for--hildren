import React, { useState } from 'react'
import styles from './ReviewModal.module.css'
import toast from 'react-hot-toast';
import fetchAxios from '../../utils/fetchAxios';
import { X } from 'lucide-react';
import { RiStarSFill } from 'react-icons/ri';

const ReviewModal = ({ isOpen, onClose, productId, orderItemId, onReviewSuccess }) => {
   const [rating, setRating] = useState(0);
   const [hover, setHover] = useState(0);
   const [formData, setFormData] = useState({
      name: '',
      advantages: '',
      flaws: '',
      comment: ''
   });

   if (!isOpen) return null;

   // Функция для полной очистки формы
   const handleClose = () => {
      setRating(0);
      setFormData({
         name: '',
         advantages: '',
         flaws: '',
         comment: ''
      });
      onClose();
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (rating === 0) return toast.error('Пожалуйста, поставьте оценку');

      try {
         const { data } = await fetchAxios.post('/api/reviews/create-review', {
            productId,
            orderItemId,
            rating,
            ...formData
         });
         if (data.success) {
            toast.success(data.message);
            // Обновляем список отзывов и скрываем кнопку
            onReviewSuccess();
            handleClose();
         }

      } catch (error) {
         toast.error(error.response?.data?.message || 'Ошибка при отправке')
      }
   }
   return (
      <div className={styles.overlay} onClick={handleClose}>
         <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleClose}><X size={20} /></button>

            <h2 className={styles.modalTitle}>Напишите отзыв о нашем товаре</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
               {/* Блок рейтинга */}
               <div className={styles.ratingSection}>
                  {[...Array(5)].map((_, index) => {
                     const ratingValue = index + 1;
                     return (
                        <label key={index}>
                           <input
                              type="radio"
                              name="rating"
                              value={ratingValue}
                              onClick={() => setRating(ratingValue)}
                           />
                           <RiStarSFill
                              className={styles.star}
                              color={ratingValue <= (hover || rating) ? "#edf824" : "#7bc9ef"}
                              onMouseEnter={() => setHover(ratingValue)}
                              onMouseLeave={() => setHover(0)}
                              size={32}
                           />
                        </label>
                     );
                  })}
               </div>

               <input
                  type="text"
                  placeholder="Ваше имя*"
                  required
                  className={styles.input}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
               />

               <textarea
                  placeholder="Достоинства"
                  className={styles.textarea}
                  onChange={e => setFormData({ ...formData, advantages: e.target.value })}
               />

               <textarea
                  placeholder="Недостатки"
                  className={styles.textarea}
                  onChange={e => setFormData({ ...formData, flaws: e.target.value })}
               />

               <textarea
                  placeholder="Комментарий"
                  className={styles.textarea}
                  rows="4"
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
               />

               <button type="submit" className={styles.submitBtn}>Отправить</button>
            </form>
         </div>
      </div>
   );
}

export default ReviewModal
