import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './OrdersPage.module.css';
import { fetchOrders } from '../../redux/slices/ordersSlice';

const OrdersPage = () => {
   const dispatch = useDispatch();
   const { items, loading } = useSelector(state => state.orders);

   useEffect(() => {
      dispatch(fetchOrders());
   }, [dispatch]);

   const getStatusClass = (status) => {
      switch (status) {
         case 'new': return styles.statusNew;
         case 'delivered': return styles.statusDone;
         case 'cancelled': return styles.statusCancel;
         default: return styles.statusProcess;
      }
   };

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <h2>Управление заказами</h2>
            <div className={styles.stats}>Всего заказов: {items.length}</div>
         </div>

         <div className={styles.tableCard}>
            <table className={styles.orderTable}>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Дата</th>
                     <th>Клиент</th>
                     <th>Сумма</th>
                     <th>Доставка</th>
                     <th>Оплата</th>
                     <th>Статус</th>
                     <th>Действие</th>
                  </tr>
               </thead>
               <tbody>
                  {items.map(order => (
                     <tr key={order.order_id}>
                        <td className={styles.orderId}>#{order.order_id}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                           <div className={styles.clientCell}>
                              <strong>{order.contact_info.fio}</strong>
                              <span>{order.contact_info.phone}</span>
                           </div>
                        </td>
                        <td className={styles.amount}>{Number(order.total_amount).toLocaleString()} ₽</td>
                        <td>
                           <span className={styles.deliveryBadge}>
                              {order.delivery_method === 'tk' ? `ТК (${order.choosing_transport_company})` : 'Самовывоз'}
                           </span>
                        </td>
                        <td>
                           <div className={styles.paymentInfo}>
                              <span className={styles.method}>{order.payment_method}</span>
                              <span className={order.payment_status === 'paid' ? styles.paid : styles.unpaid}>
                                 {order.payment_status}
                              </span>
                           </div>
                        </td>
                        <td>
                           <span className={`${styles.statusBadge} ${getStatusClass(order.order_status)}`}>
                              {order.order_status}
                           </span>
                        </td>
                        <td>
                           <button className={styles.viewBtn}>Детали</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};


export default OrdersPage
