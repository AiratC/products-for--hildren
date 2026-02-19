import React, { useState } from 'react';
import styles from './ProfilePage.module.css';
import { Pencil } from 'lucide-react';

const ProfilePage = () => {
   const [isEditing, setIsEditing] = useState({ name: false, phone: false });
   const [user, setUser] = useState({
      name: 'Анна',
      phone: '',
      email: 'annaanananana@gmail.com',
      address: 'Москва, ул. Московская 25-45'
   });

   const toggleEdit = (field) => {
      setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
   };

   const handleChange = (e, field) => {
      setUser(prev => ({ ...prev, [field]: e.target.value }));
   };

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Личные данные</h1>

         <div className={styles.userHeader}>
            <div className={styles.avatar}>
               <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
               </svg>
            </div>
            <span className={styles.emailText}>{user.email}</span>
         </div>

         {/* Имя */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Имя</span>
               <div className={styles.content}>
                  {isEditing.name ? (
                     <input
                        className={styles.inputField}
                        value={user.name}
                        onChange={(e) => handleChange(e, 'name')}
                        onBlur={() => toggleEdit('name')}
                        autoFocus
                     />
                  ) : (
                     <>
                        <span className={styles.value}>{user.name}</span>
                        <button className={styles.editBtn} onClick={() => toggleEdit('name')}>
                           <Pencil size={16} />
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* Телефон */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Телефон</span>
               <div className={styles.content}>
                  {isEditing.phone ? (
                     <input
                        className={styles.inputField}
                        placeholder="+7 (___) ___-__-__"
                        value={user.phone}
                        onChange={(e) => handleChange(e, 'phone')}
                        onBlur={() => toggleEdit('phone')}
                        autoFocus
                     />
                  ) : (
                     <>
                        <span className={styles.value}>{user.phone || 'Не указан'}</span>
                        <button className={styles.addBtn} onClick={() => toggleEdit('phone')}>
                           {user.phone ? <Pencil size={16} /> : 'Добавить'}
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* Адрес */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Адреса доставки</span>
               <div className={styles.content}>
                  <span className={styles.value}>{user.address}</span>
               </div>
            </div>
         </div>

         {/* Пароль */}
         <div className={styles.section} style={{ border: 'none' }}>
            <div className={styles.row}>
               <span className={styles.label}>Пароль</span>
               <div className={styles.content}>
                  <div className={styles.passwordBox}>************</div>
                  <button className={styles.editBtn}>Изменить</button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProfilePage
