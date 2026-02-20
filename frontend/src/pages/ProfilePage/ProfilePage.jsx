import React, { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import { Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
   const [isEditing, setIsEditing] = useState({
      name: false,
      phone: false,
      delivery_address: false,
      changePassword: false,
      oldPassword: false,
      newPassword: false,
      repeatPassword: false

   });
   const { user } = useSelector(state => state.authUser)
   const [userData, setUserData] = useState({
      name: '',
      phone: '',
      email: '',
      delivery_address: '',
      avatar: '',
      oldPassword: '',
      newPassword: '',
      repeatPassword: ''
   });
   const [showChangePassword, setShowChangePassword] = useState(false);


   // Добавляем этот блок:
   useEffect(() => {
      if (user) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setUserData({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || '',
            delivery_address: user.delivery_address || '',
            avatar: user.avatar || ''
         });
      }
   }, [user]); // Как только user в Redux изменится, данные попадут в локальный стейт

   const toggleEdit = (field) => {
      setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
   };

   const handleChange = (e, field) => {
      setUserData(prev => ({ ...prev, [field]: e.target.value }));
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
            <span className={styles.emailText}>{userData.email}</span>
         </div>

         {/* Имя */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Имя</span>
               <div className={styles.content}>
                  {isEditing.name ? (
                     <input
                        className={styles.inputField}
                        value={userData.name}
                        onChange={(e) => handleChange(e, 'name')}
                        onBlur={() => toggleEdit('name')}
                        autoFocus
                     />
                  ) : (
                     <>
                        <span className={styles.value}>{userData.name}</span>
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
                        value={userData.phone}
                        onChange={(e) => handleChange(e, 'phone')}
                        onBlur={() => toggleEdit('phone')}
                        autoFocus
                     />
                  ) : (
                     <>
                        <button className={styles.addBtn} onClick={() => toggleEdit('phone')}>
                           {userData.phone ? <Pencil size={16} /> : 'Добавить'}
                        </button>
                     </>
                  )}
               </div>
            </div>
            <div>
               <span className={styles.value}>{userData.phone || ''}</span>
            </div>
         </div>

         {/* Адрес */}
         <div className={styles.section}>
            <div className={styles.row}>
               <span className={styles.label}>Адреса доставки</span>
            </div>
            <div>
               <div className={styles.content}>
                  {
                     isEditing.delivery_address ? (
                        <input
                           className={styles.inputField}
                           placeholder="Город, Улица, дом, кв"
                           value={userData.delivery_address}
                           onChange={(e) => handleChange(e, 'delivery_address')}
                           onBlur={() => toggleEdit('delivery_address')}
                           autoFocus
                        />
                     ) : (
                        <button className={styles.addBtn} onClick={() => toggleEdit('delivery_address')}>
                           {userData.delivery_address ? <Pencil size={16} /> : 'Добавить адрес'}
                        </button>
                     )
                  }
               </div>
               <span className={styles.value}>{userData.delivery_address || ''}</span>
            </div>

         </div>

         {/* Пароль */}
         <div className={styles.section} style={{ border: 'none' }}>
            <div className={styles.row}>
               <div className={styles.content}>
                  <button onClick={() => setShowChangePassword(prev => !prev)} className={styles.editBtn}>
                     {
                        showChangePassword ? 'Закрыть' : 'Изменить пароль'
                     }

                  </button>
               </div>
            </div>
            {
               showChangePassword && (
                  <div className={styles.changePasswordContainer}>
                     <div>
                        <input
                           className={styles.inputField}
                           type="password"
                           placeholder='Старый пароль'
                           value={userData.oldPassword}
                           onChange={(e) => handleChange(e, 'oldPassword')}
                        />
                     </div>
                     <div>
                        <input
                           className={styles.inputField}
                           type="password"
                           placeholder='Новый пароль'
                           value={userData.newPassword}
                           onChange={(e) => handleChange(e, 'newPassword')}

                        />
                     </div>
                     <div>
                        <input
                           className={styles.inputField}
                           type="password"
                           placeholder='Повторите новый пароль'
                           value={userData.repeatPassword}
                           onChange={(e) => handleChange(e, 'repeatPassword')}
                        />
                     </div>
                  </div>
               )
            }

         </div>
      </div>
   );
};

export default ProfilePage
