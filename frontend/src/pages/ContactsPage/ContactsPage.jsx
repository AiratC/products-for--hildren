import React, { useState } from 'react';
import styles from './ContactsPage.module.css';
import Loader from '../../components/Loader/Loader';
import fetchAxios from '../../utils/fetchAxios';
import toast from 'react-hot-toast';

const ContactsPage = () => {
   const [formData, setFormData] = useState({
      name: '',
      phone: '',
      message: '',
      is_agree: false
   });
   const [loading, setLoading] = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         setLoading(true)
         const response = await fetchAxios.post('/api/contact/send-user-message', formData);
         if (response.data.success) {
            toast.success(response.data.message);
            setFormData({
               name: '',
               phone: '',
               message: '',
               is_agree: false
            })
         }
      } catch (error) {
         toast.error(error.response.data.message)
      } finally {
         setLoading(false)
      }
   };

   return (
      <div className={styles.containerContacts}>
         <h1 className={styles.mainTitle}>Контакты</h1>

         <div className={styles.contentWrapper}>
            {/* Левая колонка: Информация */}
            <div className={styles.infoSide}>
               <section className={styles.infoBlock}>
                  <h3>Адрес</h3>
                  <p>Республика Татарстан, г. Казань, улица Кремлевская 101</p>
               </section>

               <section className={styles.infoBlock}>
                  <h3>Телефон</h3>
                  <p>+7 900 890 7887</p>
                  <p>+7 900 890 4343</p>
               </section>

               <section className={styles.infoBlock}>
                  <h3>Электронный адрес</h3>
                  <p className={styles.email}>karapuz_101@mail.ru</p>
               </section>

               <section className={styles.infoBlock}>
                  <h3>Мы в социальных сетях</h3>
                  <div className={styles.socialIcons}>
                     <span className={styles.vkIcon}>Vk</span>
                     <span className={styles.vkIcon}>Vk</span>
                     <span className={styles.vkIcon}>Vk</span>
                     <span className={styles.vkIcon}>Vk</span>
                  </div>
               </section>
            </div>

            {/* Правая колонка форма */}
            <div className={styles.formSide}>
               <h3>Напишите нам и мы ответим на все Ваши вопросы</h3>
               <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.inputRow}>
                     <input
                        type="text"
                        placeholder='Имя'
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     />
                     <input
                        type="text"
                        placeholder='Телефон'
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     />
                  </div>
                  <textarea
                     placeholder='Сообщение'
                     rows={5}
                     value={formData.message}
                     onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>

                  <label htmlFor='agree' className={styles.checkboxLabel}>
                     <input 
                     onChange={(e) => setFormData({ ...formData, is_agree: e.target.checked })} 
                     id='agree' 
                     type="checkbox" 
                     required 
                     checked={formData.is_agree}
                     />
                     <span>Соглашение на обработку данных и пользовательское соглашение</span>
                  </label>
                  {
                     loading ? (
                        <div className={styles.contactLoader}>
                           <Loader />
                        </div>
                     ) : (
                        <button type='submit' className={styles.submitBtn}>
                           Отправить
                        </button>
                     )
                  }
               </form>
            </div>
         </div>

         {/* Карта */}
         <div className={styles.mapContainer}>
            <iframe
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2132.112514147926!2d49.11956207674841!3d55.79151547309856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x415ead113f612155%3A0x511435c1a5fe3603!2z0YPQuy4g0JrRgNC10LzQu9C10LLRgdC60LDRjywgMTAxLCDQmtCw0LfQsNC90YwsINCg0LXRgdC_LiDQotCw0YLQsNGA0YHRgtCw0L0sINCg0L7RgdGB0LjRjywgNDIwMDA4!5e1!3m2!1sru!2sca!4v1771694054207!5m2!1sru!2sca"
               width="100%"
               height="450"
               style={{ border: 0 }}
               allowFullScreen=""
               loading="lazy"
            ></iframe>
         </div>

      </div>
   )
}

export default ContactsPage
