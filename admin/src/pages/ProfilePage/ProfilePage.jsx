import React from 'react'
import { useSelector } from 'react-redux'
import styles from './ProfilePage.module.css'

const ProfilePage = () => {
   const { admin, loading } = useSelector(state => state.authAdmin);

   if (loading || !admin) {
      return <div className={styles.loader}>Загрузка данных профиля...</div>;
   }

   // Деструктуризация данных из твоего лога
   const {
      name,
      email,
      avatar,
      delivery_address,
      role_id,
      created_at
   } = admin;

   console.log({
      name,
      email,
      avatar,
      delivery_address,
      role_id,
      created_at
   })

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
      });
   };

   return (
      <div className={styles.profileContainer}>
         <div className={styles.sidebar}>
            <div className={styles.avatarWrapper}>
               <img src={avatar} alt={name} className={styles.avatar} />
               <span className={styles.roleBadge}>
                  {role_id === 1 ? 'Главный админ' : 'Модератор'}
               </span>
            </div>
            <h2 className={styles.adminName}>{name}</h2>
            <p className={styles.adminEmail}>{email}</p>
            <button className={styles.editBtn}>Редактировать профиль</button>
         </div>

         <div className={styles.mainInfo}>
            <h3 className={styles.sectionTitle}>Информация об аккаунте</h3>

            <div className={styles.infoGrid}>
               <div className={styles.infoItem}>
                  <label>Адрес доставки (офис)</label>
                  <p>{delivery_address || 'Не указан'}</p>
               </div>
               <div className={styles.infoItem}>
                  <label>Дата регистрации</label>
                  <p>{formatDate(created_at)}</p>
               </div>
               <div className={styles.infoItem}>
                  <label>Статус соглашения</label>
                  <p className={styles.status}>
                     {admin.is_agree_terms ? 'Подписано' : 'Ожидает подтверждения'}
                  </p>
               </div>
            </div>

            <div className={styles.quickActions}>
               <h3>Быстрые действия</h3>
               <div className={styles.actionButtons}>
                  <button className={styles.actionBtn}>Управление товарами</button>
                  <button className={styles.actionBtn}>Заказы в работе</button>
                  <button className={styles.actionBtnSec}>Логи безопасности</button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default ProfilePage
