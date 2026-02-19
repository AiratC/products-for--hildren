import React, { useCallback, useEffect } from 'react';
import styles from './OrdersPage.module.css';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../redux/slices/orderSlice';
import Loader from '../../components/Loader/Loader';

const OrdersPage = () => {

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const { orders, loading } = useSelector(state => state.order);

   useEffect(() => {
      const getUserOrders = async () => {
         try {
            await dispatch(getOrders()).unwrap();
         } catch (error) {
            console.log(error)
         }
      }

      getUserOrders()

   }, [dispatch])



   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);


   const getStatusColor = useCallback((status) => {
      switch (status) {
         case 'delivered': return '#27ae60';  // Зеленый
         case 'cancelled': return '#eb5757';  // Красный
         case 'processing': return '#56ccf2'; // Голубой
         default: return '#829399';           // Серый
      }
   }, []);

   const getStatusName = useCallback((status) => {
      switch (status) {
         case 'delivered': return 'Получен/Доставлен';
         case 'cancelled': return 'Отменен';
         case 'processing': return 'В пути';
         default: return 'Оформлен';
      }
   }, [])

   const getPaymentMethodName = useCallback((paymentName) => {
      switch (paymentName) {
         case 'card': return 'Картой онлайн';
         case 'cash_courier': return 'Наличными курьеру';
         case 'paypal': return 'PayPal';
         case 'cash_on_delivery': return 'Наличными при получении';
         default: return 'Ожидание оплаты';
      }
   }, [])

   // Способ получения
   const getDeliveryMethodName = useCallback((deliveryName) => {
      switch (deliveryName) {
         case 'tk': return 'Транспортная компания';
         case 'post': return 'Почта';
         case 'self': return 'Самовывоз';
         default: return 'Не выбрано';
      }
   }, [])

   // 3. Исправляем условие проверки (проверяем на массив и длину)
   if (!loading && (!orders || orders.length === 0)) {
      return (
         <div className={styles.notOrdersContainer}>
            <p>У вас ещё нет заказов</p>
            <button onClick={() => navigate('/')}>На главную</button>
         </div>
      );
   }

   if (loading) {
      return (
         <div>
            <Loader />
         </div>
      )
   }

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Мои заказы</h1>
         <div className={styles.ordersGrid}>
            {
               Array.isArray(orders) && (
                  orders.map((order) => (
                     <div key={order.order_id} className={styles.orderCard}>
                        {/* Шапка заказа */}
                        <div className={styles.orderHeader}>
                           <span className={styles.orderNumber}>Заказ №{order.order_id}</span>
                           <div className={styles.status}>
                              <span
                                 className={styles.statusDot}
                                 style={{ backgroundColor: getStatusColor(order.order_status) }}
                              ></span>
                              <span style={{ color: getStatusColor(order.order_status) }}>{getStatusName(order.order_status)}</span>
                           </div>
                        </div>

                        {/* СПИСОК ТОВАРОВ В ЗАКАЗЕ */}
                        <div className={styles.itemsList}>
                           {order.items.map((item) => (
                              <div key={item.order_id + '-' + item.product_id} className={styles.productItem}>
                                 <div className={styles.productImgWrapper}>
                                    <img src={item.image} alt={item.title} className={styles.productImg} />
                                 </div>
                                 <div className={styles.productInfo}>
                                    <p className={styles.productTitle}>{item.title}</p>
                                    <span className={styles.productCount}>{item.quantity} шт.</span>
                                 </div>
                              </div>
                           ))}
                        </div>

                        {/* Детальная информация */}
                        <div className={styles.detailsBody}>
                           <div className={styles.detailsRow}>
                              <span className={styles.label}>Дата оформления</span>
                              <span className={styles.value}>{
                                 new Date(order.created_at).toLocaleDateString('ru-RU')
                              }</span>
                           </div>
                           <div className={styles.detailsRow}>
                              <span className={styles.label}>Способ оплаты</span>
                              <span className={styles.value}>
                                 {getPaymentMethodName(order.payment_method)} — {order.total_amount.toLocaleString()} ₽
                              </span>
                           </div>
                           <div className={styles.detailsRow}>
                              <span className={styles.label}>Способ получения</span>
                              <span className={styles.value}>{getDeliveryMethodName(order.delivery_method)}</span>
                           </div>
                           {
                              order.delivery_method !== 'self' && (
                                 <div className={styles.detailsRow}>
                                    <span className={styles.label}>Адрес доставки</span>
                                    <span className={styles.value}>{order.address}</span>
                                 </div>
                              )
                           }

                           <div className={styles.detailsRow}>
                              <span className={styles.label}>Получатель</span>
                              <span className={styles.value}>{order.contact_info?.fullName || 'Не указан'}</span>
                           </div>
                           {
                              order.delivery_method !== 'self' && (
                                 <div className={styles.detailsRow}>
                                    <span className={styles.label}>Дата доставки</span>
                                    <span className={styles.value}>{order.delivery_date}</span>
                                 </div>
                              )
                           }

                           {
                              order.delivery_method !== 'self' && (
                                 <div className={styles.detailsRow}>
                                    <span className={styles.label}>Стоимость доставки</span>
                                    <span className={`${styles.value} ${styles.free}`}>Бесплатно</span>
                                 </div>
                              )
                           }
                        </div>
                     </div>
                  ))
               )

            }
         </div>
      </div>
   );
};

export default OrdersPage;
