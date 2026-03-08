import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './OptPage.module.css';
import { fetchWholesaleRequests } from '../../redux/slices/wholesaleSlice';

const OptPage = () => {
   const dispatch = useDispatch();
   const { items, loading } = useSelector(state => state.wholesale);

   useEffect(() => {
      dispatch(fetchWholesaleRequests());
   }, [dispatch]);

   if (loading) return <div className={styles.loader}>Загрузка заявок...</div>;

   return (
      <div className={styles.container}>
         <header className={styles.header}>
            <h2>Заявки от оптовых клиентов</h2>
            <span className={styles.count}>Всего: {items.length}</span>
         </header>

         <div className={styles.tableWrapper}>
            <table className={styles.table}>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Клиент</th>
                     <th>Контакты</th>
                     <th>Город</th>
                     <th>Согласие</th>
                     <th>Действия</th>
                  </tr>
               </thead>
               <tbody>
                  {items.map((req) => (
                     <tr key={req.id} className={styles.row}>
                        <td># {req.id}</td>
                        <td>
                           <div className={styles.name}>{req.name}</div>
                        </td>
                        <td>
                           <div className={styles.contactInfo}>
                              <span>📞 {req.phone}</span>
                              <span>✉️ {req.email}</span>
                           </div>
                        </td>
                        <td>{req.city}</td>
                        <td>
                           <span className={req.is_agree ? styles.agree : styles.disagree}>
                              {req.is_agree ? 'Принято' : 'Нет'}
                           </span>
                        </td>
                        <td>
                           <button className={styles.callBtn}>Связаться</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default OptPage
