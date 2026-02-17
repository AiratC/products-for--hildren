import React, { useCallback } from 'react';
import styles from './OrdersPage.module.css';
import { useNavigate } from 'react-router';

const OrdersPage = () => {
   // Если данных пока нет, можно использовать моковые данные для теста
   const mockOrders = [
      {
         id: "5454647",
         status: "Получен",
         date: "21.05.2020",
         payment_method: "Картой онлайн",
         total_amount: 152000,
         delivery_method: "Транспортной компанией",
         address: "Москва, ул. Московская 25-45",
         recipient: "Анна Москова, +7 919 919 99 99",
         delivery_date: "с 25 мая",
         items: [
            {
               id: 1,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            },
            {
               id: 2,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            },
            {
               id: 3,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            }
         ]
      },
      {
         id: "5454647",
         status: "Получен",
         date: "21.05.2020",
         payment_method: "Картой онлайн",
         total_amount: 152000,
         delivery_method: "Транспортной компанией",
         address: "Москва, ул. Московская 25-45",
         recipient: "Анна Москова, +7 919 919 99 99",
         delivery_date: "с 25 мая",
         items: [
            {
               id: 1,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            },
            {
               id: 2,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 2
            }
         ]
      },
      {
         id: "5454647",
         status: "Получен",
         date: "21.05.2020",
         payment_method: "Картой онлайн",
         total_amount: 152000,
         delivery_method: "Транспортной компанией",
         address: "Москва, ул. Московская 25-45",
         recipient: "Анна Москова, +7 919 919 99 99",
         delivery_date: "с 25 мая",
         items: [
            {
               id: 1,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            }
         ]
      },
      {
         id: "5454647",
         status: "Получен",
         date: "21.05.2020",
         payment_method: "Картой онлайн",
         total_amount: 152000,
         delivery_method: "Транспортной компанией",
         address: "Москва, ул. Московская 25-45",
         recipient: "Анна Москова, +7 919 919 99 99",
         delivery_date: "с 25 мая",
         items: [
            {
               id: 1,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            },
            {
               id: 2,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            },
            {
               id: 3,
               title: "Коляска CYBEX PRIAM LUX JEREMY SCOTT SPECIAL EDITION 2 В 1 на раме TREKKING",
               image: "https://ir.ozone.ru/s3/multimedia-1-s/wc1000/8039793088.jpg", // Замени на реальный URL
               quantity: 1
            }
         ]
      }
   ];
   // const mockOrders = [];
   const navigate = useNavigate();

   const currentOrders = mockOrders || [];


   const getStatusColor = useCallback((status) => {
      switch (status) {
         case 'Получен': return '#27ae60';
         case 'Отменен': return '#eb5757';
         case 'В пути': return '#56ccf2';
         default: return '#829399';
      }
   }, []);

   if(currentOrders.length === 0) {
      return (
         <div className={styles.notOrdersContainer}>
            У вас ещё нет заказов
            <button onClick={() => navigate('/')}>
               Главная
            </button>
         </div>
      )
   }

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Мои заказы</h1>
         <div className={styles.ordersGrid}>
            {currentOrders.map((order) => (
               <div key={order.id} className={styles.orderCard}>
                  {/* Шапка заказа */}
                  <div className={styles.orderHeader}>
                     <span className={styles.orderNumber}>Заказ №{order.id}</span>
                     <div className={styles.status}>
                        <span
                           className={styles.statusDot}
                           style={{ backgroundColor: getStatusColor(order.status) }}
                        ></span>
                        <span style={{ color: getStatusColor(order.status) }}>{order.status}</span>
                     </div>
                  </div>

                  {/* СПИСОК ТОВАРОВ В ЗАКАЗЕ */}
                  <div className={styles.itemsList}>
                     {order.items.map((item) => (
                        <div key={item.id} className={styles.productItem}>
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
                        <span className={styles.value}>{order.date}</span>
                     </div>
                     <div className={styles.detailsRow}>
                        <span className={styles.label}>Способ оплаты</span>
                        <span className={styles.value}>
                           {order.payment_method} — {order.total_amount.toLocaleString()} ₽
                        </span>
                     </div>
                     <div className={styles.detailsRow}>
                        <span className={styles.label}>Способ получения</span>
                        <span className={styles.value}>{order.delivery_method}</span>
                     </div>
                     <div className={styles.detailsRow}>
                        <span className={styles.label}>Адрес доставки</span>
                        <span className={styles.value}>{order.address}</span>
                     </div>
                     <div className={styles.detailsRow}>
                        <span className={styles.label}>Получатель</span>
                        <span className={styles.value}>{order.recipient}</span>
                     </div>
                     <div className={styles.detailsRow}>
                        <span className={styles.label}>Дата доставки</span>
                        <span className={styles.value}>{order.delivery_date}</span>
                     </div>
                     <div className={styles.detailsRow}>
                        <span className={styles.label}>Стоимость доставки</span>
                        <span className={`${styles.value} ${styles.free}`}>Бесплатно</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default OrdersPage;
